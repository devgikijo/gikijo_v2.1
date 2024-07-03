import { PAGES } from '../../../utils/constants';
import { getServiceSupabase } from '../../../utils/supabase';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const {
      customerId,
      totalPrice,
      bulkSendQue,
      bulkToken,
      user_uuid,
      postfixSuccessUrl,
    } = req.body;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'myr', // Malaysian Ringgit
            product_data: {
              name: 'Send To Channel',
            },
            unit_amount: totalPrice * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      // metadata: {
      //   // Add your additional data here
      //   bulk_send_que: bulkSendQue,
      // },
      mode: 'payment',
      success_url: `${req.headers.referer}${postfixSuccessUrl}`,
      cancel_url: `${req.headers.referer}`,
    });

    if (session) {
      let dataToUpdate = {
        provider: 'stripe',
        session_id: session.id,
        status: session.status,
        customer_id: session.customer,
        user_uuid: user_uuid,
        total_price: totalPrice,
      };

      const { data, error } = await supabase
        .from('payment_session')
        .upsert(dataToUpdate, { onConflict: 'session_id' })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error, message: error.message });
      }

      bulkSendQue.map((item) => {
        item.session_id = data.session_id;
      });

      const { data: data2, error: error2 } = await supabase
        .from('job_post_send_que')
        .insert(bulkSendQue) // bulk insert (array)
        .select();

      if (error2) {
        return res.status(400).json({ error: error2, message: error2.message });
      }

      if (bulkToken.length > 0) {
        var newBulkToken = [];
        bulkToken.map((item) => {
          newBulkToken.push({ id: item.id, used_session_id: data.session_id });
        });

        const { data: data3, error: error3 } = await supabase
          .from('token')
          .upsert(newBulkToken) // bulk insert (array)
          .select();

        if (error3) {
          return res
            .status(400)
            .json({ error: error3, message: error3.message });
        }
      }

      res.send(data);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default handler;
