import { useState, useEffect } from 'react';
import JobFilter from '../components/JobFilter';
import JobDetails from '../components/JobDetails';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useApiCall } from '../context/apiCall';
import { PAGES } from '../utils/constants';
import Breadcrumb from '../components/BreadCrumb';

const main = () => {
  const router = useRouter();
  const { getJobDetailsApi } = useApiCall();
  const [mainData, setMainData] = useState({
    jobDetails: { data: null, isLoading: false },
  });

  const getJobDetails = async (jobId) => {
    try {
      const data = await getJobDetailsApi({
        job_uid: jobId,
      });

      setMainData((prevData) => ({
        ...prevData,
        jobDetails: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (router.query?.jobId) {
      getJobDetails(router.query.jobId);
    }
  }, [router]);

  return (
    <div className="body">
      <section class="container">
        <Breadcrumb page={PAGES.viewJob} />
        <JobFilter showTitle={false} navigateToJobs={true} />
        <div class="card vh-100">
          <JobDetails
            item={mainData.jobDetails.data}
            showBtnExternalPage={false}
          />
        </div>
      </section>
    </div>
  );
};

export default main;
