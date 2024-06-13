import { useState, useEffect, useRef } from 'react';
import { useApiCall } from '../context/apiCall';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import ResumeForm from '../components/ResumeForm';
import JobDeckCard from '../components/JobDeckCard';
import Offcanvas from 'react-bootstrap/Offcanvas';
import JobDetails from '../components/JobDetails';
import GlobalButton from '../components/GlobalButton';
import { PAGES, STAGGER_CHILD_VARIANTS } from '../utils/constants';
import { useModal } from '../context/modal';
import JobPostTable from '../components/JobPostTable';
import CompanyProfileTable from '../components/CompanyProfileTable';
import CompanyProfileForm from '../components/CompanyProfileForm';
import { useTempData } from '../context/tempData';
import JobPostModal from '../components/JobPostModal';

const main = () => {
  const { apiData, updateAccountTypeApi, addResumeApi, updateOnboardingApi } =
    useApiCall();
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
      title: 'I want to find a job',
      onClick: async () => {
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

        if (result) {
          setStep('createResume');
        }
      },
      icon: <i class="bi bi-search-heart h1 text-primary"></i>,
    },
    jobSeeker: {
      title: 'I want to post a job',
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
      icon: <i class="bi bi-megaphone h1 text-primary"></i>,
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
      <motion.h6 variants={STAGGER_CHILD_VARIANTS} class="mb-0 text-primary">
        {steps}
      </motion.h6>
      <motion.h1 variants={STAGGER_CHILD_VARIANTS} class="mb-0">
        {title}
      </motion.h1>
      <motion.p variants={STAGGER_CHILD_VARIANTS} class="lead text-muted">
        {subtitle}
      </motion.p>
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        class="lead text-muted text-start"
      >
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
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
      <motion.h1 variants={STAGGER_CHILD_VARIANTS}>
        {navigationSection(prevSection, nextSection)}
      </motion.h1>
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
              <motion.div variants={STAGGER_CHILD_VARIANTS} class="mt-4">
                <div class="row row-cols-1 row-cols-md-2 g-4">
                  {Object.values(mainAccessConfig).map((config, index) => (
                    <div class="col" onClick={config.onClick} key={index}>
                      <div class="card card-move hover-click">
                        <div class="card-body row">
                          <div class="col text-center">{config.icon}</div>
                          <h5 class="card-title font-weight-bold mt-3">
                            {config.title}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
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
          subtitle="Let's Design Your Job Opportunity"
          customBody={
            <>
              <JobPostTable />
              <div class="text-center">
                {!apiData.jobPost.isLoading &&
                apiData.jobPost.data.length == 0 ? (
                  <span
                    class="text-primary clickable"
                    onClick={() => {
                      setStep('completedEmployer');
                    }}
                  >
                    Skip
                  </span>
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
              <motion.h1 variants={STAGGER_CHILD_VARIANTS} class="mt-4">
                🎉
              </motion.h1>
              <motion.div variants={STAGGER_CHILD_VARIANTS} class="mt-4">
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
                      router.push(PAGES.profile.directory);
                    }
                  }}
                >
                  Company Profile <i class="bi bi-arrow-right-short"></i>
                </GlobalButton>
              </motion.div>
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
            <div class="text-center">
              <motion.div
                variants={STAGGER_CHILD_VARIANTS}
                class="lead text-muted text-start"
              >
                <JobDeckCard />
              </motion.div>
              <motion.div variants={STAGGER_CHILD_VARIANTS}>
                <GlobalButton
                  btnType="button"
                  btnClass="btn btn-outline-primary btn-lg"
                  btnOnClick={() => {
                    setStep('completedJobSeeker');
                  }}
                >
                  Continue <i class="bi bi-arrow-right-short"></i>
                </GlobalButton>
              </motion.div>
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
              <motion.h1 variants={STAGGER_CHILD_VARIANTS} class="mt-4">
                🎉
              </motion.h1>
              <motion.div variants={STAGGER_CHILD_VARIANTS} class="mt-4">
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
                      router.push(PAGES.profile.directory);
                    }
                  }}
                >
                  View Profile <i class="bi bi-arrow-right-short"></i>
                </GlobalButton>
              </motion.div>
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
        <motion.div
          className="z-10"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, type: 'spring' }}
          key={currentSection}
        >
          <motion.div
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {viewConfig[currentSection]?.view}
          </motion.div>
        </motion.div>
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
