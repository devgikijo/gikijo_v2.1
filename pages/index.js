import { useState, useEffect } from 'react';
import Layout from '../components/layout';
import JobDeckCard from '../components/JobDeckCard';
import CompanyDeckCard from '../components/CompanyDeckCard';
import TopicDeckCard from '../components/TopicDeckCard';
import { useApiCall } from '../context/apiCall';
import { useRouter } from 'next/router';
import { EMPLOYMENT_TYPES, PAGES } from '../utils/constants';
import Offcanvas from 'react-bootstrap/Offcanvas';
import JobDetails from '../components/JobDetails';
import GlobalButton from '../components/GlobalButton';
import JobFilter from '../components/JobFilter';
import JobTypeBadge from '../components/JobTypeBadge';
import { useModal } from '../context/modal';

const Index = () => {
  const { apiData } = useApiCall();
  const { isModalOpen, toggleModal } = useModal();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      toggleModal('news');
    }, 500);
  }, []);

  const mainAccessConfig = {
    cardOne: {
      title: 'Find Job',
      onClick: () => {
        router.push(PAGES.jobs.directory);
      },
      description: 'Explore and Apply for Jobs.',
      icon: <i class="bi bi-search-heart h1 text-primary"></i>,
    },
    cardTwo: {
      title: 'Post Job',
      onClick: () => {
        router.push(PAGES.postJob.directory);
      },
      description: 'Publish and Share Job Posts.',
      icon: <i class="bi bi-megaphone h1 text-primary"></i>,
    },
  };

  return (
    <div className="body">
      <Layout>
        <section class="container">
          <JobFilter
            showTitle={true}
            showFilter={false}
            navigateToJobs={true}
          />
          <div class="row row-cols-1 row-cols-md-2 g-4">
            {Object.values(mainAccessConfig).map((config, index) => (
              <div class="col" onClick={config.onClick} key={index}>
                <div class="card card-move hover-click" id="find-job-btn">
                  <div class="card-body row">
                    <div class="col-8">
                      <h5
                        class="card-title font-weight-bold"
                        data-lang-key="global.find_job"
                      >
                        {config.title}
                      </h5>
                      <p
                        class="card-text"
                        data-lang-key="index.explore_and_xxx"
                      >
                        {config.description}
                      </p>
                    </div>
                    <div class="col text-center">{config.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <JobTypeBadge />
          <h5 data-lang-key="global.latest_job">Latest Jobs</h5>
          <JobDeckCard />
          <h5 data-lang-key="global.latest_companies">Latest Companies</h5>
          <CompanyDeckCard
            isLoading={apiData.topCompanyProfile?.isLoading}
            isEmpty={
              !apiData.topCompanyProfile?.isLoading &&
              apiData.topCompanyProfile.data.length == 0
            }
            item={apiData.topCompanyProfile?.data}
          />

          {/* <h5 data-lang-key="global.latest_topics">Latest Topics</h5>
          <TopicDeckCard item={[]} /> */}

          <Offcanvas
            show={isModalOpen.jobDetails}
            onHide={() => {
              toggleModal('jobDetails');
            }}
            placement="end"
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>
              <JobDetails />
            </Offcanvas.Body>
          </Offcanvas>
        </section>
      </Layout>
    </div>
  );
};

export default Index;
