import { getServiceSupabase } from '../../../utils/supabase';
import { TEMP_DATA } from './TEMP_IMPORT_DATA';

export default async function handler(req, res) {
  //   if (req.method !== 'POST') {
  //     res.setHeader('Allow', ['POST']);
  //     return res.status(405).end(`Method ${req.method} Not Allowed`);
  //   }

  try {
    const supabase = getServiceSupabase();

    // const usersData = req.body; // Assuming usersData is an array of user data

    const usersData = TEMP_DATA;

    const promises = usersData.map((user) => {
      const { username, email } = user;
      return supabase.auth.admin.createUser({
        user_metadata: { name: username },
        email: email,
        email_confirm: true,
      });
    });

    const results = await Promise.all(promises);

    if (results.some((result) => result.error)) {
      const errors = results
        .filter((result) => result.error)
        .map((result) => result.error);
      return res.status(400).json({ errors });
    }

    return res.status(200).json({ data: results });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
