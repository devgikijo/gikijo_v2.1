import { getServiceSupabase } from '../../../utils/supabase';
import initStripe from 'stripe';
import { buffer } from 'micro';

export const config = { api: { bodyParser: false } };

const handler = async (req, res) => {
  // function to validate the request is actually is coming from Stripe
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  const signingSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  try {
    let event;
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);

    let status = '';

    switch (event.type) {
      case 'checkout.session.async_payment_succeeded':
        status = 'succeeded';
        break;
      case 'checkout.session.async_payment_failed':
        status = 'failed';
        break;
      case 'checkout.session.completed':
        status = 'completed';
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    const supabase = getServiceSupabase();

    if (status === 'completed') {
      const { data, error } = await supabase
        .from('payment_session')
        .update({
          status: event.data.object.status ?? 'completed', // Default to 'completed' if status is undefined
        })
        .eq('session_id', event.data.object.id)
        .select()
        .single();

      if (error) {
        return res
          .status(400)
          .json({ message: error.message, error: error.stack });
      }

      const { data: data2, error: error2 } = await supabase
        .from('job_post_send_que')
        .update({
          payment_complete: true,
        })
        .eq('session_id', event.data.object.id);

      if (error2) {
        return res
          .status(400)
          .json({ message: error2.message, error: error2.stack });
      }

      res.send({ received: true });
    } else {
      res.send({ received: true });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message, error: error.stack });
  }
};

export default handler;
