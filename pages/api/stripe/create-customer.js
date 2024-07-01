import initStripe from 'stripe';
import { getServiceSupabase } from '../../../utils/supabase';

const handler = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { email, user_uuid } = req.body;
    const { data: existingAccount, error } = await supabase
      .from('profile')
      .select('stripe_customer_id')
      .eq('user_uuid', user_uuid)
      .single();

    if (existingAccount && existingAccount?.stripe_customer_id) {
      return res.send({
        stripe_customer_id: existingAccount.stripe_customer_id,
        message: 'Existing customer',
      });
    }

    if (error) {
      return res.status(400).json({ error: error, message: error.message });
    }

    const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

    const customer = await stripe.customers.create({
      email: email,
    });

    const { data: existingAccount2, error2 } = await supabase
      .from('profile')
      .update({ stripe_customer_id: customer.id })
      .eq('user_uuid', user_uuid)
      .select()
      .single();

    if (error2) {
      return res.status(400).json({ error: error2, message: error2.message });
    }

    res.send({
      stripe_customer_id: existingAccount2.stripe_customer_id,
      message: 'New customer created!',
    });
  } catch (error) {
    return res.status(400).json({ message: 'Something went wrong' });
  }
};

export default handler;
