import { getServiceSupabase } from '../../../utils/supabase';
import { Resend } from 'resend';
import ReactDOMServer from 'react-dom/server';
import NewApplicantNotification from './email-apply-templete';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const supabase = getServiceSupabase();
    const resend = new Resend(process.env.RESEND_TOKEN);
    const { postData } = req.body;

    const { data, error } = await supabase
      .from('profile')
      .select('email, username')
      .eq('user_uuid', postData.job_post.user_uuid)
      .single();

    if (error) {
      return res.status(400).json({ error: error, message: error.message });
    }

    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      <NewApplicantNotification
        employerName={data?.username ? data.username : 'Employer'}
        jobTitle={postData.job_post.title}
        employerCompanyName={
          postData.job_post?.company_profile?.company_name
            ? postData.job_post.company_profile.company_name
            : 'your company'
        }
        applicantName={postData.applicant_name}
        applicantRemarks={postData.applicant_remarks}
        linkToApplication={process.env.NEXT_PUBLIC_DOMAIN_URL}
      />
    );

    await resend.emails.send({
      from: `Gikijo <${process.env.RESEND_SENDER_EMAIL}>`,
      to: data.email,
      subject: 'New Applicant for Your Job Posting - Review Required',
      html: emailHtml,
    });

    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
