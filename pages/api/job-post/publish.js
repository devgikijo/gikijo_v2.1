import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const supabase = getServiceSupabase();
    const { job_post_id, is_published } = req.body;

    const currentDateTime = new Date().toISOString();

    const { data, error } = await supabase
      .from('job_post_validity')
      .upsert(
        [
          {
            job_post_id,
            updated_at: currentDateTime,
            is_published: is_published,
          },
        ],
        {
          onConflict: ['job_post_id'],
        }
      )
      .select();

    if (error) {
      return res.status(400).json({ error: error, message: error.message });
    }

    return res.status(200).json({ data: data.length > 0 ? data[0] : [] });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
