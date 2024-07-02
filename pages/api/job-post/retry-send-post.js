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
      const { data: data2, error: error2 } = await supabase
        .from('job_post_send_que')
        .update({
          payment_complete: true,
        })
        .eq('id', job_post_send_que_id)
        .select('*, payment_session (*)')
        .single();

      if (error2) {
        return res.status(400).json({ error: error2, message: error2.message });
      }

      return res.status(200).json({ data: data2 });
    } else {
      return res.status(200).json({ data: data });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
