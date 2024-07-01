import { useState, useEffect, useRef } from 'react';
import SideBar from '../components/SideBar.js';
import JobPostModal from '../components/JobPostModal.js';
import PageHeader from '../components/PageHeader.js';
import {
  APPLICATION_ACTION_STATUS,
  APPLICATION_STATUS,
  EMPLOYMENT_TYPES,
  IMAGES,
  PAGES,
} from '../utils/constants.js';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Breadcrumb from '../components/BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import moment from 'moment';
import ApplicationActionModal from '../components/ApplicationActionModal.js';
import JobDetails from '../components/JobDetails.js';
import EmptyData from '../components/EmptyData.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import Image from 'next/image.js';
import GlobalButton from '../components/GlobalButton.js';
import { useRouter } from 'next/router.js';

const main = () => {
  const { apiData, getApplicationApi } = useApiCall();
  const router = useRouter();
  const [toggleModal, setToggleModal] = useState({
    application: false,
    jobDetails: false,
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [remarksExpanded, setRemarksExpanded] = useState({});
  const [employerRemarksExpanded, setEmployerRemarksExpanded] = useState({});

  const handleClose = (key) => {
    setToggleModal((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  useEffect(() => {
    if (apiData.profile.isLoading == false) {
      getApplicationApi();
    }
  }, [apiData.profile.isLoading]);

  return (
    <SideBar>
      <div class="container ps-0">
        <Breadcrumb page={PAGES.applicants} />
        <PageHeader
          title={PAGES.application.name}
          description={PAGES.application.description}
        />
        <ApplicationActionModal
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
          applicationData={selectedApplication}
        />
        <LoadingSpinner isLoading={apiData.application.isLoading} />
        {!apiData.application.isLoading &&
        apiData.application.data.length == 0 ? (
          <EmptyData
            icon={
              <Image
                src="/images/time-39-491b4.svg"
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 100, height: 'auto' }}
                class="d-inline-block align-text-top"
              />
            }
            title="No application yet"
            description={
              <div class="text-center">
                <p>Apply to jobs and track your applications status here.</p>
                <GlobalButton
                  btnType="button"
                  btnClass="btn btn-primary me-2 mb-2"
                  btnOnClick={() => {
                    router.push(PAGES.jobs.directory);
                  }}
                >
                  <i class="bi bi-search me-1"></i> Find Job
                </GlobalButton>
              </div>
            }
          />
        ) : (
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {apiData.application.data?.map((item, index) => {
                const data = {
                  title: item.job_post ? item.job_post.title : 'Deleted',
                  employmentType: item.job_post
                    ? EMPLOYMENT_TYPES.find(
                        (type) => type.value === item.job_post.employment_type
                      )?.name
                    : '-',
                  createdAt: moment(item.created_at).fromNow(),
                  application_status: item.application_status,
                  applicationStatusName:
                    (
                      APPLICATION_STATUS.find(
                        (status) => status.value === item.application_status
                      ) || {}
                    ).name || 'Status not found',
                  applicationActionStatusName:
                    (
                      APPLICATION_ACTION_STATUS.find(
                        (status) =>
                          status.value === item.application_action_status
                      ) || {}
                    ).name || 'Status not found',
                  employerRemarks: item?.employer_remarks
                    ? item.employer_remarks
                    : '-',
                  applicantRemarks: item?.applicant_remarks
                    ? item.applicant_remarks
                    : '-',
                };

                return (
                  <tr key={index}>
                    <td scope="row" className="row">
                      <div className="col col-md-5">
                        <h6
                          class="clickable mb-0"
                          onClick={() => {
                            if (item.job_post) {
                              setToggleModal({
                                ...toggleModal,
                                jobDetails: true,
                              });
                              setSelectedJob(item.job_post);
                            }
                          }}
                        >
                          {data.title}
                        </h6>
                        <div className="row">
                          <small>
                            <div className="col text-muted">
                              {data.employmentType}
                              <i class="bi bi-dot"></i>
                              Applied {data.createdAt}
                              <div className="row mt-1">
                                {data.applicantRemarks ? (
                                  <div>
                                    <i class="bi bi-chat-text me-1"></i>{' '}
                                    {data.applicantRemarks.length > 30 ? (
                                      <span>
                                        {remarksExpanded[index]
                                          ? data.applicantRemarks
                                          : `${data.applicantRemarks.substring(
                                              0,
                                              30
                                            )}...`}
                                        <span
                                          class="clickable text-primary ms-1"
                                          onClick={() => {
                                            setRemarksExpanded({
                                              ...remarksExpanded,
                                              [index]: !remarksExpanded[index],
                                            });
                                          }}
                                        >
                                          {remarksExpanded[index] ? (
                                            <small>
                                              read less
                                              <i class="bi bi-chevron-up ms-1"></i>
                                            </small>
                                          ) : (
                                            <small>
                                              read more
                                              <i class="bi bi-chevron-down ms-1"></i>
                                            </small>
                                          )}
                                        </span>
                                      </span>
                                    ) : (
                                      <span>{data.applicantRemarks}</span>
                                    )}
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          </small>
                        </div>
                      </div>
                      <div className="col-lg col-md mt-3 mt-md-0">
                        <div className="row">
                          <div className="col">
                            <div style={{ 'word-break': 'break-all' }}>
                              <small className="text-muted">
                                Employer's Remarks
                              </small>
                              <br />
                              <small>
                                {data.employerRemarks.length > 30 ? (
                                  <span>
                                    {employerRemarksExpanded[index]
                                      ? data.employerRemarks
                                      : `${data.employerRemarks.substring(
                                          0,
                                          30
                                        )}...`}
                                    <span
                                      class="clickable text-primary ms-1"
                                      onClick={() => {
                                        setEmployerRemarksExpanded({
                                          ...employerRemarksExpanded,
                                          [index]:
                                            !employerRemarksExpanded[index],
                                        });
                                      }}
                                    >
                                      {employerRemarksExpanded[index] ? (
                                        <small>
                                          read less
                                          <i class="bi bi-chevron-up ms-1"></i>
                                        </small>
                                      ) : (
                                        <small>
                                          read more
                                          <i class="bi bi-chevron-down ms-1"></i>
                                        </small>
                                      )}
                                    </span>
                                  </span>
                                ) : (
                                  <span>{data.employerRemarks}</span>
                                )}
                              </small>
                            </div>
                          </div>
                          <div className="col">
                            <>
                              <small className="text-muted">Status</small>
                              <br />
                              <small
                                class="clickable text-primary"
                                onClick={() => {
                                  setToggleModal({
                                    ...toggleModal,
                                    application: true,
                                  });
                                  setSelectedApplication(item);
                                }}
                              >
                                {data.applicationStatusName}
                              </small>
                            </>
                          </div>
                          {/* <div className="col">
                            <div class="dropdown">
                              <i
                                class="bi bi-three-dots-vertical clickable"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              ></i>
                              <ul class="dropdown-menu">
                                <li>
                                  <a
                                    class="dropdown-item"
                                    onClick={() => {
                                      setToggleModal({
                                        ...toggleModal,
                                        application: true,
                                      });
                                      setSelectedApplication(item);
                                    }}
                                  >
                                    New Action
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Offcanvas
          show={toggleModal.jobDetails}
          onHide={() => {
            handleClose('jobDetails');
          }}
          placement="end"
        >
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body>
            <JobDetails item={selectedJob} />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </SideBar>
  );
};

export default main;
