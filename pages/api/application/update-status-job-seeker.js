import { getServiceSupabase } from '../../../utils/supabase';
import { Resend } from 'resend';
import ReactDOMServer from 'react-dom/server';
import NewStatusJobSeeker from './templete-job-seeker-status';
import { APPLICATION_STATUS } from '../../../utils/constants';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const supabase = getServiceSupabase();
    const resend = new Resend(process.env.RESEND_TOKEN);
    const { postData, applicationData } = req.body;

    const { data, error } = await supabase
      .from('application')
      .update({
        ...postData,
      })
      .eq('id', applicationData?.applicant?.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error, message: error.message });
    }

    const { data: profileData, error: errorProfile } = await supabase
      .from('profile')
      .select('email, username')
      .eq('user_uuid', applicationData?.applicant?.applicant_uuid)
      .single();

    const jobInfo = applicationData?.jobPost;

    let newStatus = null;
    newStatus = APPLICATION_STATUS.find(
      (status) => status.value === data?.application_status
    );

    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      <NewStatusJobSeeker
        applicantName={
          profileData?.username ? profileData.username : 'Job Seeker'
        }
        jobTitle={jobInfo?.title}
        employerCompanyName={
          jobInfo?.company_profile?.company_name
            ? jobInfo.company_profile?.company_name
            : '-'
        }
        applicationStatus={newStatus?.name ? newStatus.name : '-'}
        employerRemarks={data?.employer_remarks}
        linkToWebsite={process.env.NEXT_PUBLIC_DOMAIN_URL}
      />
    );

    await resend.emails.send({
      from: `Gikijo <${process.env.RESEND_SENDER_EMAIL}>`,
      to: profileData?.email,
      subject: 'Important: Your Application Status Has Been Updated',
      html: emailHtml,
    });

    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
