import { useState, useEffect, useRef } from 'react';
import { useApiCall } from '../context/apiCall';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import ResumeForm from '../components/ResumeForm';
import JobDeckCard from '../components/JobDeckCard';
import Offcanvas from 'react-bootstrap/Offcanvas';
import JobDetails from '../components/JobDetails';
import GlobalButton from '../components/GlobalButton';
import { PAGES } from '../utils/constants';
import { useModal } from '../context/modal';
import JobPostTable from '../components/JobPostTable';
import CompanyProfileTable from '../components/CompanyProfileTable';
import CompanyProfileForm from '../components/CompanyProfileForm';
import { useTempData } from '../context/tempData';
import JobPostModal from '../components/JobPostModal';
import Image from 'next/image';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import AnimatedComponent from '../components/AnimatedComponent';

const main = () => {
  const {
    apiData,
    updateAccountTypeApi,
    addResumeApi,
    updateOnboardingApi,
    addNotificationApi,
  } = useApiCall();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState('getStarted');
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    if (
      currentSection !== 'getStarted' ||
      currentSection !== 'completedJobSeeker' ||
      currentSection !== 'completedEmployer'
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSection]);

  const mainAccessConfig = {
    employer: {
      title: 'Find Job',
      onClick: async () => {
        try {
          const result = await updateAccountTypeApi({
            postData: {
              accountType: 'job_seeker',
            },
          });

          const resultResume = await addResumeApi({
            postData: {
              uid: apiData.resume.data?.uid ?? null,
            },
          });

          if (result && resultResume) {
            setStep('createResume');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
      icon: (
        <Image
          src="/images/search-12.svg"
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 70, height: 70 }}
          class="d-inline-block align-text-top"
        />
      ),
    },
    jobSeeker: {
      title: 'Post Job',
      onClick: async () => {
        const result = await updateAccountTypeApi({
          postData: {
            accountType: 'employer',
          },
        });

        if (result) {
          setStep('createCompanyProfile');
        }
      },
      icon: (
        <Image
          src="/images/marketing-12.svg"
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 70, height: 70 }}
          class="d-inline-block align-text-top"
        />
      ),
    },
  };

  const navigationSection = (prevPage, nextPage) => {
    return (
      <div class="mt-4">
        {prevPage ? (
          <i
            class="bi bi-arrow-left me-3 clickable"
            onClick={() => {
              setStep(prevPage);
            }}
          ></i>
        ) : (
          <i class="bi bi-arrow-left me-3 opacity-25"></i>
        )}
        {/* {nextPage ? (
          <i
            class="bi bi-arrow-right ms-3 clickable"
            onClick={() => setStep(nextPage)}
          ></i>
        ) : ( */}
        <i class="bi bi-arrow-right ms-3 opacity-25"></i>
        {/* )} */}
      </div>
    );
  };

  const SectionView = ({
    title,
    subtitle,
    section,
    customBody,
    nextSection,
    prevSection,
    steps,
    type,
  }) => (
    <div>
      <AnimatedComponent key={1}>
        <h6 class="mb-0 text-primary">{steps}</h6>
        <h1 class="mb-0">{title}</h1>
        <p class="lead text-muted">{subtitle}</p>
        <div class="text-muted text-start">
          {customBody ? (
            customBody
          ) : (
            <>
              <div class="card">
                <div class="card-body">
                  {type == 'jobSeeker' ? (
                    <ResumeForm
                      section={section}
                      onSuccessFunction={() => {
                        setStep(nextSection);
                      }}
                      buttonTitle="Next"
                    />
                  ) : (
                    ''
                  )}
                  {type == 'employer' ? (
                    <CompanyProfileForm
                      section={section}
                      onSuccessFunction={() => {
                        setStep(nextSection);
                      }}
                      buttonTitle="Next"
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <h1>{navigationSection(prevSection, nextSection)}</h1>
      </AnimatedComponent>
    </div>
  );

  const viewConfig = {
    getStarted: {
      view: (
        <SectionView
          title="Let's Get Started"
          subtitle="What would you like to do?"
          customBody={
            <div class="text-center">
              <div class="row row-cols-1 row-cols-md-2 g-4">
                {Object.values(mainAccessConfig).map((config, index) => (
                  <div class="col" onClick={config.onClick} key={index}>
                    <div class="card card-move hover-click">
                      <div class="card-body row">
                        <div class="col text-center">{config.icon}</div>
                        <h4 class="card-title font-weight-bold mt-3">
                          {config.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
          steps="WELCOME!"
        />
      ),
    },
    createCompanyProfile: {
      view: (
        <SectionView
          type="employer"
          title="Let's Set Up Your Company Profile"
          subtitle="Tell us a bit about your company"
          section="basicInfo"
          prevSection="getStarted"
          nextSection="createBusinessOverview"
          steps="1/4"
        />
      ),
    },
    createBusinessOverview: {
      view: (
        <SectionView
          type="employer"
          title="Your Business Overview"
          subtitle="Highlight Your Business's Core Information"
          section="businessOverview"
          prevSection="createCompanyProfile"
          nextSection="createJobPost"
          steps="2/4"
        />
      ),
    },
    createJobPost: {
      view: (
        <SectionView
          type="employer"
          title="Create Your Job Post"
          subtitle="Let's Design Your First Job Post"
          customBody={
            <>
              <div>
                <JobPostTable />
              </div>
              <div class="text-center">
                {!apiData.jobPost.isLoading &&
                apiData.jobPost.data.length == 0 ? (
                  <>
                    {/* <span
                    class="text-primary clickable"
                    onClick={() => {
                      setStep('completedEmployer');
                    }}
                  >
                    Skip
                  </span> */}
                  </>
                ) : (
                  <>
                    <GlobalButton
                      btnType="button"
                      btnClass="btn btn-outline-primary btn-lg me-2"
                      btnOnClick={() => {
                        toggleModal('jobPost');
                        setValueTempData('selectedItem', {
                          ...tempData.selectedItem,
                          publishModalConfigType: 'create',
                        });
                      }}
                    >
                      <i class="bi bi-plus-lg"></i> Create More
                    </GlobalButton>
                    <GlobalButton
                      btnType="button"
                      btnClass="btn btn-primary btn-lg me-2"
                      btnOnClick={() => {
                        setStep('completedEmployer');
                      }}
                    >
                      Continue <i class="bi bi-arrow-right-short"></i>
                    </GlobalButton>
                  </>
                )}
              </div>
            </>
          }
          prevSection="createBusinessOverview"
          nextSection="completedEmployer"
          steps="3/4"
        />
      ),
    },
    completedEmployer: {
      view: (
        <SectionView
          type="employer"
          title="Well done!"
          subtitle="You've finished setting up your company profile."
          customBody={
            <div class="text-center">
              <Image
                src="/images/approval-5.svg"
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 150, height: 'auto' }}
                class="d-inline-block align-text-top mt-4"
              />
              <div class="mt-4">
                <GlobalButton
                  btnType="button"
                  btnClass="btn btn-primary btn-lg"
                  btnOnClick={async () => {
                    const result = await updateOnboardingApi({
                      postData: {
                        onboarding: !apiData.profile.data?.onboarding,
                      },
                    });

                    if (result) {
                      await addNotificationApi({
                        message: 'Welcome to your dashboard! 🎉',
                        message_detail: `We're excited to have you with us. Take some time to look around and get familiar with everything here!`,
                      });
                      router.push(PAGES.profile.directory);
                    }
                  }}
                >
                  View Company Profile <i class="bi bi-arrow-right-short"></i>
                </GlobalButton>
              </div>
            </div>
          }
          prevSection="createJobPost"
          steps="4/4"
        />
      ),
    },
    createResume: {
      view: (
        <SectionView
          type="jobSeeker"
          title="Let's Build Your Profile"
          subtitle="Tell us a bit about yourself"
          section="personalDetails"
          prevSection="getStarted"
          nextSection="jobDetails"
          steps="1/8"
        />
      ),
    },
    jobDetails: {
      view: (
        <SectionView
          type="jobSeeker"
          title="Your Work Goals"
          subtitle="Share what you do and what you're looking for"
          section="jobDetails"
          prevSection="createResume"
          nextSection="workExperience"
          steps="2/8"
        />
      ),
    },
    workExperience: {
      view: (
        <SectionView
          type="jobSeeker"
          title="Your Work Experience"
          subtitle="Share your work history and achievements"
          section="workExperience"
          prevSection="jobDetails"
          nextSection="educationHistory"
          steps="3/8"
        />
      ),
    },
    educationHistory: {
      view: (
        <SectionView
          type="jobSeeker"
          title="Your Educational Background"
          subtitle="Share your educational journey"
          section="educationHistory"
          prevSection="workExperience"
          nextSection="skills"
          steps="4/8"
        />
      ),
    },
    skills: {
      view: (
        <SectionView
          type="jobSeeker"
          title="Your Skills"
          subtitle="Share what you're good at"
          section="skills"
          prevSection="educationHistory"
          nextSection="languages"
          steps="5/8"
        />
      ),
    },
    languages: {
      view: (
        <SectionView
          type="jobSeeker"
          title="Languages You Speak"
          subtitle="List the languages you speak"
          section="languages"
          prevSection="skills"
          nextSection="applyJob"
          steps="6/8"
        />
      ),
    },
    applyJob: {
      view: (
        <SectionView
          type="jobSeeker"
          title="Get Going!"
          subtitle="Start Applying or Check Your Profile"
          customBody={
            <div>
              <JobDeckCard showSeeMore={false} />
              <div class="text-center">
                <GlobalButton
                  btnType="button"
                  btnClass="btn btn-primary btn-lg"
                  btnOnClick={() => {
                    setStep('completedJobSeeker');
                  }}
                >
                  Skip for now <i class="bi bi-arrow-right-short"></i>
                </GlobalButton>
              </div>
            </div>
          }
          prevSection="languages"
          nextSection="completedJobSeeker"
          steps="7/8"
        />
      ),
    },
    completedJobSeeker: {
      view: (
        <SectionView
          type="jobSeeker"
          title="Well done!"
          subtitle="You've finished setting up your profile."
          customBody={
            <div class="text-center">
              <Image
                src="/images/approval-5.svg"
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 150, height: 'auto' }}
                class="d-inline-block align-text-top mt-4"
              />
              <div class="mt-4">
                <GlobalButton
                  btnType="button"
                  btnClass="btn btn-primary btn-lg"
                  btnOnClick={async () => {
                    const result = await updateOnboardingApi({
                      postData: {
                        onboarding: !apiData.profile.data?.onboarding,
                      },
                    });
                    if (result) {
                      await addNotificationApi({
                        message: 'Welcome to your dashboard! 🎉',
                        message_detail: `We're excited to have you with us. Take some time to look around and get familiar with everything here!`,
                      });

                      router.push(PAGES.profile.directory);
                    }
                  }}
                >
                  View Profile <i class="bi bi-arrow-right-short"></i>
                </GlobalButton>
              </div>
            </div>
          }
          prevSection="applyJob"
          steps="8/8"
        />
      ),
    },
  };

  const setStep = (stepName) => {
    if (stepName in viewConfig) {
      setCurrentSection(stepName);
      router.replace(`${router.pathname}?step=${stepName}`);
    } else {
      setCurrentSection('getStarted');
    }
  };

  useEffect(() => {
    const { profile } = apiData;
    const { isLoading, data } = profile;

    if (!isLoading) {
      if (data?.account_type) {
        if (data?.onboarding) {
          router.push(PAGES.dashboard.directory);
        } else {
          setIsPageReady(true);
          if (router?.query?.step) {
            setStep(router?.query?.step);
          } else {
            if (data.account_type == 'employer') {
              setStep('createCompanyProfile');
            }
            if (data.account_type == 'job_seeker') {
              setStep('createResume');
            }
          }
        }
      } else {
        setIsPageReady(true);
      }
    }
  }, [apiData.profile.isLoading]);

  if (!isPageReady) {
    return (
      <div className="body">
        <section class="container text-center"></section>
      </div>
    );
  }

  return (
    <div className="body">
      <section class="container text-center">
        {viewConfig[currentSection]?.view}
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
    </div>
  );
};

export default main;
