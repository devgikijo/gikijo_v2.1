import { getServiceSupabase } from '../../../utils/supabase';
import { Resend } from 'resend';
import ReactDOMServer from 'react-dom/server';
import NewStatusEmployer from './templete-employer-status';
import { APPLICATION_ACTION_STATUS } from '../../../utils/constants';

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
      .eq('id', applicationData?.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error, message: error.message });
    }

    const { data: resumeData, error: errorResume } = await supabase
      .from('resume')
      .select('full_name')
      .eq('user_uuid', applicationData?.user_uuid)
      .single();

    const jobInfo = applicationData?.job_post;

    const { data: employerData, error: errorEmployer } = await supabase
      .from('profile')
      .select('email, username')
      .eq('user_uuid', jobInfo?.user_uuid)
      .single();

    let newStatus = null;
    newStatus = APPLICATION_ACTION_STATUS.find(
      (status) => status.value === data?.application_action_status
    );

    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      <NewStatusEmployer
        employerName={
          employerData?.username ? employerData.username : 'Employer'
        }
        jobTitle={jobInfo?.title}
        employerCompanyName={
          jobInfo?.company_profile?.company_name
            ? jobInfo.company_profile?.company_name
            : '-'
        }
        applicantName={
          resumeData?.full_name ? resumeData.full_name : 'Job Seeker'
        }
        applicationStatus={newStatus?.name ? newStatus.name : '-'}
        applicantRemarks={data?.applicant_remarks}
        linkToWebsite={process.env.NEXT_PUBLIC_DOMAIN_URL}
      />
    );

    await resend.emails.send({
      from: `Gikijo <${process.env.RESEND_SENDER_EMAIL}>`,
      to: employerData?.email,
      subject: 'Important: Application Status Update',
      html: emailHtml,
    });

    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
}
