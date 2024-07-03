import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const supabase = getServiceSupabase();
    const { job_post_send_que_id } = req.body;

    const { data, error } = await supabase
      .from('job_post_send_que')
      .select('*, payment_session (*)')
      .eq('id', job_post_send_que_id)
      .single();

    if (error) {
      return res.status(400).json({ error: error, message: error.message });
    }

    if (
      data?.payment_session?.status == 'complete' &&
      data?.send_result?.ok !== true
    ) {
      if (data.payment_complete == false) {
        const { data: data2, error: error2 } = await supabase
          .from('job_post_send_que')
          .update({
            payment_complete: true,
          })
          .eq('id', job_post_send_que_id)
          .select('*, payment_session (*)')
          .single();

        if (error2) {
          return res
            .status(400)
            .json({ error: error2, message: error2.message });
        }

        return res.status(200).json({ data: data2 });
      }
      if (data.payment_complete == true) {
        const { data: data3, error: error3 } = await supabase
          .from('job_post_send_que')
          .update({
            payment_complete: false,
          })
          .eq('id', job_post_send_que_id)
          .select('*, payment_session (*)')
          .single();

        if (error3) {
          return res
            .status(400)
            .json({ error: error3, message: error3.message });
        }

        if (data3) {
          const { data: data4, error: error4 } = await supabase
            .from('job_post_send_que')
            .update({
              payment_complete: true,
            })
            .eq('id', job_post_send_que_id)
            .select('*, payment_session (*)')
            .single();

          if (error4) {
            return res
              .status(400)
              .json({ error: error4, message: error4.message });
          }

          return res.status(200).json({ data: data4 });
        }
      }
    } else {
      return res.status(200).json({ data: data });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
