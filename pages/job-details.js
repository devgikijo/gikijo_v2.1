import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '../components/BreadCrumb';
import { PAGES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

const main = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const { postId } = router.query;
    if (postId) {
      router.push(`${PAGES.viewJob.directory}?jobId=${postId}`);
    }

    setTimeout(() => {
      setShowAlert(true);
    }, 2000);
  }, [router.query]);

  return (
    <div className="body">
      <section class="container">
        <Breadcrumb page={PAGES.job_details_old} />
        <LoadingSpinner isLoading />
        {showAlert ? (
          <div class="text-center">
            <h4>
              Redirecting to job details... <br />
              If it takes too long,{' '}
              <span
                class="text-primary clickable"
                onClick={() => {
                  router.push(PAGES.jobs.directory);
                }}
              >
                click here
              </span>{' '}
              to explore more job opportunities.
            </h4>
          </div>
        ) : (
          ''
        )}
      </section>
    </div>
  );
};

export default main;
