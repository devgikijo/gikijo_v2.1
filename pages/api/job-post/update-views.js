import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const supabase = getServiceSupabase();
    const { postId } = req.body;

    const { data, error } = await supabase
      .from('job_post_validity')
      .select('view_count')
      .eq('job_post_id', postId)
      .single();

    if (error) {
      return res.status(400).json({ error: error, message: error.message });
    }

    if (data) {
      const { data: data2, error: error2 } = await supabase
        .from('job_post_validity')
        .update({
          view_count: data?.view_count + 1,
        })
        .eq('job_post_id', postId);

      if (error2) {
        return res.status(400).json({ error: error2, message: error2.message });
      }
    }

    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
