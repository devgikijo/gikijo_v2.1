import { useState, useEffect } from 'react';
import SideBar from '../components/SideBar.js';
import Link from 'next/link';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useApiCall } from '../context/apiCall.js';
import {
  COUNTRIES,
  CURRENT_JOB_STATUS,
  EMPLOYMENT_TYPES,
  PAGES,
} from '../utils/constants.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import EmptyData from '../components/EmptyData.js';
import GlobalButton from '../components/GlobalButton.js';
import Breadcrumb from '../components/BreadCrumb.js';
import PageHeader from '../components/PageHeader.js';
import { findInArray, getDisplayValue } from '../utils/helper.js';
import Joyride from 'react-joyride';

const main = () => {
  const { apiData, updateNotificationApi, updateProductTourApi } = useApiCall();
  const router = useRouter();

  const [isPageReady, setIsPageReady] = useState(false);

  const { isLoading: companyIsLoading, data: companyData } =
    apiData.companyProfile;
  const { isLoading: jobPostIsLoading, data: jobPostData } = apiData.jobPost;
  const { isLoading: applicationIsLoading, data: applicationData } =
    apiData.application;
  const { isLoading: resumeIsLoading, data: resumeData } = apiData.resume;

  const publishedJobPost = jobPostData.filter(
    (jobPost) => jobPost?.job_post_validity?.is_published === true
  );

  const unpublishedJobPost = jobPostData.filter(
    (jobPost) => jobPost?.job_post_validity?.is_published === false
  );

  const applicantJobPost = jobPostData.filter(
    (jobPost) => jobPost?.application?.length > 0
  );

  const countApplications = jobPostData.reduce((total, jobPost) => {
    return total + (jobPost?.application ? jobPost.application.length : 0);
  }, 0);

  const pendingApplication = applicationData.filter(
    (application) => application?.application_status === 'pending'
  );

  const offeredApplication = applicationData.filter(
    (application) => application?.application_status === 'offered'
  );

  const overviewConfigTop = {
    cardOne: {
      employer: {
        title: 'Company Profile',
        onClick: () => {
          router.push(PAGES.profile.directory);
        },
        description: 'Manage your company profile',
        icon: <i class="bi bi-building h1 text-white"></i>,
      },
      job_seeker: {
        title: 'My Profile',
        onClick: () => {
          router.push(PAGES.profile.directory);
        },
        description: 'Manage your user profile',
        icon: <i class="bi bi-file-earmark-person h1"></i>,
      },
    },
    cardTwo: {
      employer: {
        title: 'Job Post',
        onClick: () => {
          router.push(PAGES.job_post.directory);
        },
        description: 'Manage your job post',
        icon: <i class="bi bi-megaphone h1 text-white"></i>,
      },
      job_seeker: {
        title: 'My Application',
        onClick: () => {
          router.push(PAGES.application.directory);
        },
        description: 'Check your application status',
        icon: <i class="bi bi-file-earmark-arrow-up h1"></i>,
      },
    },
  };

  const overviewConfigBottom = {
    cardOne: {
      employer: {
        title: 'Published',
        onClick: () => {
          router.push(PAGES.job_post.directory);
        },
        total: publishedJobPost.length,
        icon: <i class="bi bi-check2-circle h5 text-secondary me-2" />,
      },
      job_seeker: {
        title: 'Applied',
        onClick: () => {
          router.push(PAGES.application.directory);
        },
        total: applicationData.length,
        icon: <i class="bi bi-file-earmark-arrow-up h5 text-secondary me-2" />,
      },
    },
    cardTwo: {
      employer: {
        title: 'Unpublished',
        onClick: () => {
          router.push(PAGES.job_post.directory);
        },
        total: unpublishedJobPost.length,
        icon: <i class="bi bi-pause-circle h5 text-secondary me-2" />,
      },
      job_seeker: {
        title: 'Pending',
        onClick: () => {
          router.push(PAGES.application.directory);
        },
        total: pendingApplication.length,
        icon: <i class="bi bi-clock-history h5 text-secondary me-2" />,
      },
    },
    cardThree: {
      employer: {
        title: 'Applicants',
        onClick: () => {
          router.push(PAGES.applicants.directory);
        },
        total: countApplications,
        icon: <i class="bi bi-people h5 text-secondary me-2" />,
      },
      job_seeker: {
        title: 'Offered',
        onClick: () => {
          router.push(PAGES.application.directory);
        },
        total: offeredApplication.length,
        icon: <i class="bi bi-check2-circle h5 text-secondary me-2" />,
      },
    },
  };

  const tourConfig = {
    job_seeker: {
      steps: [
        {
          target: '.tour-overview',
          content: `Let's take a look around. From this view, you can get a quick overview of your job application status.`,
        },
        {
          target: '.tour-quick-access',
          content:
            'Here, you can find shortcuts to manage your recent activities.',
        },
        {
          target: '.tour-notification',
          content: `Don't worry about missing important alerts and messages. You can see all your notifications right here.`,
        },
        {
          target: '.tour-resume-profile',
          content: `To see your live resume profile, click this button.`,
        },
      ],
    },
    employer: {
      steps: [
        {
          target: '.tour-overview',
          content: `Let's take a look around. From this view, you can get a quick overview of your job posting's status and the number of applicants so far.`,
        },
        {
          target: '.tour-quick-access',
          content:
            'Here, you can find shortcuts to manage your recent activities.',
        },
        {
          target: '.tour-notification',
          content: `Don't worry about missing important alerts and messages. You can see all your notifications right here.`,
        },
        {
          target: '.tour-channel',
          content: `Here's a list of channels offered on this site where you can share your job posting. Feel free to explore them!`,
        },
        {
          target: '.tour-company-profile',
          content: `To see your live company profile, click this button.`,
        },
      ],
    },
  };

  const overviewCard = (type) => {
    return (
      <div class="col">
        <div class="row mb-2 g-2">
          {Object.values(overviewConfigBottom).map((config, index) => (
            <>
              {config[type] ? (
                <div class="col" key={index}>
                  <div onClick={config[type]?.onClick}>
                    <div class="card card-move">
                      <div class="card-body row">
                        <div class="col mb-2">
                          {config[type]?.icon}
                          <span class="card-title font-weight-bold">
                            {config[type]?.title}
                          </span>
                        </div>
                        <h2>{config[type]?.total}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          ))}
        </div>
      </div>
    );
  };

  const notificationCard = () => {
    return (
      <>
        <div class="card">
          <div class="card-body scrollable-list p-1">
            {apiData.notification.isLoading ? (
              <LoadingSpinner isLoading={true} />
            ) : (
              <>
                {apiData.notification.data.length > 0 ? (
                  <ul class="list-group list-group-flush">
                    {apiData.notification.data.map((item, index) => {
                      return (
                        <li
                          key={index}
                          class={`list-group-item list-group-item-action justify-between py-3 ${
                            item.is_read ? 'text-muted' : ''
                          }`}
                          onClick={() => {
                            if (item?.action_url) {
                              if (!item.is_read) {
                                updateNotificationApi({
                                  id: item.id,
                                });
                              }
                              router.push(item?.action_url);
                            }
                          }}
                        >
                          <div class="d-flex justify-content-between mb-2">
                            <div>
                              <h6 class="mb-1">{item.message}</h6>
                              <small>{item.message_detail}</small>
                            </div>
                          </div>
                          <div class="d-flex justify-content-between">
                            {item.action_title ? (
                              <strong
                                class="text-primary clickable small"
                                style={{ fontSize: '13px' }}
                              >
                                {item.action_title}{' '}
                                <i class="bi bi-arrow-right-short"></i>
                              </strong>
                            ) : (
                              <div></div>
                            )}
                            <small style={{ fontSize: '13px' }}>
                              {moment(item?.created_at).fromNow()}
                            </small>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <EmptyData
                    icon={<i class="fs-5 bi bi-bell"></i>}
                    title="No notification yet"
                    description="There is no notification to show right now."
                  />
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  const quickAccessConfig = {
    cardZero: {
      job_seeker: {
        title: 'Find Job',
        description: (
          <p>
            {!resumeIsLoading
              ? `Keep looking for jobs that suit you and apply to them. This will improve your chances of getting hired.`
              : 'Loading...'}
          </p>
        ),
        button: (
          <GlobalButton
            btnType="button"
            btnClass="btn btn-outline-primary btn-blog w-100"
            btnOnClick={() => {
              router.push(PAGES.jobs.directory);
            }}
          >
            <i class="bi bi-search me-1"></i> Find Job
          </GlobalButton>
        ),
      },
    },
    cardOne: {
      employer: {
        title: 'Company Profile',
        list: (
          <>
            {!companyIsLoading ? (
              <ul class="list-unstyled bg-light rounded-2 p-2">
                <li>
                  <small class="text-muted">Company Name</small>
                  <p
                    class="fw-bold mb-0 text-truncate"
                    style={{ maxWidth: '200px' }}
                  >
                    {companyData?.company_name || '-'}
                  </p>
                </li>
              </ul>
            ) : (
              <></>
            )}
          </>
        ),
        description: (
          <p>
            Keep your company profile current with the latest updates to engage
            the best candidates.
          </p>
        ),
        button: (
          <GlobalButton
            btnType="button"
            btnClass="btn btn-outline-primary btn-blog w-100"
            btnOnClick={() => {
              router.push(`${PAGES.job_post.directory}?createPost=true`);
            }}
          >
            <i class="bi bi-plus-lg me-1"></i> Create Post
          </GlobalButton>
        ),
      },
      job_seeker: {
        title: 'My Profile',
        list: (
          <>
            {!resumeIsLoading && resumeData ? (
              <ul class="list-unstyled bg-light rounded-2 p-2">
                <li>
                  <small class="text-muted">Full Name</small>
                  <p
                    class="fw-bold mb-0 text-truncate"
                    style={{ maxWidth: '200px' }}
                  >
                    {resumeData?.full_name || '-'}
                  </p>
                </li>
              </ul>
            ) : (
              <></>
            )}
          </>
        ),
        description: (
          <p>
            Regularly update your profile with your latest accomplishments to
            market yourself effectively.
          </p>
        ),
        button: (
          <GlobalButton
            btnType="button"
            btnClass="btn btn-outline-primary btn-blog w-100"
            btnOnClick={() => {
              router.push(PAGES.profile.directory);
            }}
          >
            <i class="bi bi-person-circle me-1"></i> View Profile
          </GlobalButton>
        ),
      },
    },
    cardTwo: {
      employer: {
        title: 'Last Job Post',
        list: (
          <>
            {jobPostData.length > 0 ? (
              <ul class="list-unstyled bg-light rounded-2 p-2">
                <li>
                  <small class="text-muted">Title</small>
                  <p
                    class="fw-bold mb-0 text-truncate"
                    style={{ maxWidth: '200px' }}
                  >
                    {jobPostData[0]?.title || '-'}
                  </p>
                </li>
              </ul>
            ) : (
              <></>
            )}
          </>
        ),
        description: (
          <p>
            {!jobPostIsLoading
              ? jobPostData.length > 0
                ? `You have ${jobPostData.length} job post right now. Create more job post and share it on all of our channels!`
                : `Create and publish your first job post today and share it on all of our channels!`
              : 'Loading...'}
          </p>
        ),
        button: (
          <GlobalButton
            btnType="button"
            btnClass="btn btn-outline-primary btn-blog w-100"
            btnOnClick={() => {
              router.push(`${PAGES.job_post.directory}?createPost=true`);
            }}
          >
            <i class="bi bi-plus-lg me-1"></i> Create Post
          </GlobalButton>
        ),
      },
      job_seeker: {
        title: 'Last Application',
        list: (
          <>
            {applicationData.length > 0 ? (
              <ul class="list-unstyled bg-light rounded-2 p-2">
                <li>
                  <small class="text-muted">Job Title</small>
                  <p
                    class="fw-bold mb-0 text-truncate"
                    style={{ maxWidth: '200px' }}
                  >
                    {applicationData[0]?.job_post?.title || '-'}
                  </p>
                </li>
              </ul>
            ) : (
              <></>
            )}
          </>
        ),
        description: (
          <p>
            {!applicationIsLoading
              ? applicationData.length > 0
                ? `Congratulations on submitting your application! make sure to keep track of any updates on the status of your application.`
                : `Keep looking for jobs that suit you and apply to them. This will improve your chances of getting hired.`
              : 'Loading...'}
          </p>
        ),
        button: (
          <GlobalButton
            btnType="button"
            btnClass="btn btn-outline-primary btn-blog w-100"
            btnOnClick={() => {
              router.push(PAGES.application.directory);
            }}
          >
            <i class="bi bi-file-earmark-arrow-up me-1"></i> View Application
          </GlobalButton>
        ),
      },
    },
    cardThree: {
      employer: {
        title: 'Last Applicant',
        list: (
          <>
            {jobPostData.length > 0 ? (
              <ul class="list-unstyled bg-light rounded-2 p-2">
                <li>
                  <small class="text-muted">Full Name</small>
                  <p
                    class="fw-bold mb-0 text-truncate"
                    style={{ maxWidth: '200px' }}
                  >
                    {applicantJobPost[0]?.application[0]?.resume?.full_name ||
                      '-'}
                  </p>
                </li>
              </ul>
            ) : (
              <></>
            )}
          </>
        ),
        description: (
          <p>
            {!jobPostIsLoading
              ? countApplications > 0
                ? `You currently have ${countApplications} application. you can manage it through your applicants page.`
                : `You have ${countApplications} application right now, you can manage it through your applicants page.`
              : 'Loading...'}
          </p>
        ),
        button: (
          <GlobalButton
            btnType="button"
            btnClass="btn btn-outline-primary btn-blog w-100"
            btnOnClick={() => {
              router.push(PAGES.applicants.directory);
            }}
          >
            <i class="bi bi-people me-1"></i> View Applicants
          </GlobalButton>
        ),
      },
    },
  };

  const quickAccessCard = (type) => {
    return (
      <div className="row g-2">
        {/* <div class="row g-2">
          {Object.values(overviewConfigTop).map((config, index) => (
            <div key={index} class="col-lg">
              {config[type] ? (
                <div onClick={config[type]?.onClick}>
                  <div class="card card-move " id="find-job-btn">
                    <div class="card-body row">
                      <div class="col text-center">{config[type]?.icon}</div>
                      <div class="col-9">
                        <h6 class="card-text mb-0">{config[type]?.title}</h6>
                        <small>{config[type]?.description}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div> */}

        {Object.values(quickAccessConfig).map((config, index) => (
          <>
            {config[type] ? (
              <div className="col-sm" key={index}>
                <div className="card h-100">
                  <div className="card-body row d-grid gap-2">
                    <h6 className="card-title font-weight-bold">
                      {config[type]?.title}
                    </h6>
                    <div className="text-muted small">
                      {config[type]?.list}
                      {config[type]?.description}
                    </div>
                    <div className="text-center d-flex align-items-end">
                      {config[type]?.button}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        ))}
      </div>
    );
  };

  const channelCard = () => {
    return (
      <>
        <div class="card">
          <div class="card-body scrollable-list p-1">
            {apiData.allChannel.isLoading ? (
              <LoadingSpinner isLoading={true} />
            ) : (
              <>
                {apiData.allChannel.data.length > 0 ? (
                  <ul class="list-group list-group-flush">
                    {apiData.allChannel.data.map((item, index) => {
                      return (
                        <li
                          key={index}
                          class="list-group-item list-group-item-action justify-between py-3"
                          onClick={() => {}}
                        >
                          <div class="d-flex justify-content-between mb-1">
                            <div>
                              <h6 class="mb-1">{item.title}</h6>
                              <small>{item.description}</small>
                            </div>
                            <i class="bi bi-arrow-right-short"></i>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <EmptyData
                    icon={<i class="fs-5 bi bi-bell"></i>}
                    title="No channel yet"
                    description="There is no channel to show right now."
                  />
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (apiData.profile.isLoading == false) {
      if (
        apiData.profile.data.account_type &&
        apiData.profile.data.onboarding == true
      ) {
        setIsPageReady(true);
      } else {
        router.push(PAGES.onboard.directory);
      }
    }
  }, [apiData.profile.isLoading]);

  const handleCancelProductTour = async (status = false) => {
    await updateProductTourApi({
      postData: {
        productTour: status,
      },
    });
  };

  const callbackProductTour = (data) => {
    const { action } = data;
    if (action === 'reset') {
      handleCancelProductTour(!apiData.profile.data?.product_tour);
    }
  };

  if (!isPageReady) {
    return (
      <div className="body">
        <section class="container text-center"></section>
      </div>
    );
  }

  return (
    <SideBar>
      {apiData.profile.data?.product_tour === false && (
        <Joyride
          steps={tourConfig[apiData.profile.data?.account_type]?.steps}
          continuous={true}
          showSkipButton={true}
          callback={callbackProductTour}
          styles={{
            options: {
              primaryColor: '#0d6efd',
            },
          }}
        />
      )}
      <div class="container ps-0">
        <Breadcrumb page={PAGES.dashboard} />
        <PageHeader
          title={`Hello${
            apiData.profile.data?.username
              ? `, ${apiData.profile.data.username}`
              : ''
          }!`}
          description={PAGES.dashboard.description}
        />
        <div class="row">
          <div class="col-md-8 mb-3">
            <div class="mb-3 tour-overview">
              <h6>Overview</h6>
              {overviewCard(apiData.profile.data?.account_type)}
            </div>
            <div class="tour-quick-access">
              <h6>Quick Access</h6>
              {quickAccessCard(apiData.profile.data?.account_type)}
            </div>
          </div>
          <div class="col">
            <div class="col tour-notification">
              <h6>Notifications</h6>
              {notificationCard()}
            </div>
          </div>
          {/* <div class="row mb-4">
            {apiData.profile.data?.account_type == 'employer' ? (
              <div class="col tour-channel">
                <h6>Channels</h6>
                {channelCard()}
              </div>
            ) : (
              ''
            )}
          </div> */}
        </div>
      </div>
    </SideBar>
  );
};

export default main;
