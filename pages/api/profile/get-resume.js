import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const supabase = getServiceSupabase();
    const { uid, requestor_uuid } = req.body;

    const { data, error } = await supabase
      .from('resume')
      .select('*, profile (username)')
      .eq('uid', uid);

    if (error) {
      return res.status(400).json({ error: error, message: error.message });
    }

    if (requestor_uuid && requestor_uuid !== data[0].user_uuid) {
      const { data: data2, error: error2 } = await supabase
        .from('profile')
        .select('account_type')
        .eq('user_uuid', requestor_uuid)
        .single();
      // console.log('Employer request to view');
      if (error2) {
        return res.status(400).json({ error: error2, message: error2.message });
      }
      if (data2.account_type == 'employer') {
        return res.status(200).json({ data: data });
      }
    } else if (requestor_uuid === data[0].user_uuid) {
      // console.log('Job seeker view own profile');
      return res.status(200).json({ data: data });
    } else {
      // console.log('Unauthorized view 1');
      return res.status(200).json({ data: [] });
    }
  } catch (error) {
    // console.log('Unauthorized view 2');
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
