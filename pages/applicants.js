import { useState, useEffect, useRef } from 'react';
import SideBar from '../components/SideBar.js';
import JobPostModal from '../components/JobPostModal.js';
import PageHeader from '../components/PageHeader.js';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { APPLICATION_STATUS, IMAGES, PAGES } from '../utils/constants.js';
import Breadcrumb from '../components/BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import { useRouter } from 'next/router';
import moment from 'moment';
import ApplicationModal from '../components/ApplicationModal.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import EmptyData from '../components/EmptyData.js';
import JobDetails from '../components/JobDetails.js';
import GlobalButton from '../components/GlobalButton.js';
import Image from 'next/image.js';

const main = () => {
  const { apiData } = useApiCall();
  const router = useRouter();

  const [toggleModal, setToggleModal] = useState({
    application: false,
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [remarksExpanded, setRemarksExpanded] = useState({});

  const handleClose = (key) => {
    setToggleModal((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const getApplicantList = () => {
    var applicants = [];
    apiData.jobPost.data?.map((jobPost, index) => {
      jobPost.application.map((application, index2) => {
        applicants.push(application);
      });
    });

    return applicants.length;
  };

  return (
    <SideBar>
      <div class="container ps-0">
        <Breadcrumb page={PAGES.applicants} />
        <PageHeader
          title={PAGES.applicants.name}
          description={PAGES.applicants.description}
        />
        <ApplicationModal
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
          applicationData={selectedApplication}
        />
        <LoadingSpinner isLoading={apiData.jobPost.isLoading} />
        {!apiData.jobPost.isLoading && getApplicantList() == 0 ? (
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
            title="No applicant yet"
            description={
              apiData.jobPost.data.length > 0 ? (
                'No applications have been received so far.'
              ) : (
                <div class="text-center">
                  <p>It looks like you haven't created any job posts yet.</p>
                  <GlobalButton
                    btnType="button"
                    btnClass="btn btn-primary me-2 mb-2"
                    btnOnClick={() => {
                      router.push(
                        `${PAGES.job_post.directory}?createPost=true`
                      );
                    }}
                  >
                    <i class="bi bi-plus-lg me-1"></i> Create Post
                  </GlobalButton>
                </div>
              )
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
              {apiData.jobPost.data?.map((jobPost, index) =>
                jobPost.application.map((application, index2) => {
                  const applicant = {
                    employer_remarks: application.employer_remarks,
                    applicant_remarks: application.applicant_remarks,
                    applicant_uuid: application.user_uuid,
                    resume_uid: application.resume?.uid,
                    id: application.id,
                    createdAt: moment(application.created_at).fromNow(),
                    fullName: application.resume?.full_name,
                    email: application.resume?.email,
                    phoneNumber: application.resume?.phone_number,
                    state: application.resume.state,
                    application_status: application.application_status,
                    applicationStatusName:
                      (
                        APPLICATION_STATUS.find(
                          (status) =>
                            status.value === application.application_status
                        ) || {}
                      ).name || 'Status not found',
                    application_action_status:
                      application.application_action_status,
                  };

                  const openProfile = () => {
                    window.open(
                      `${PAGES.profile.directory}?type=resume&uid=${applicant.resume_uid}`,
                      '_blank'
                    );
                  };

                  return (
                    <tr key={`${index}-${index2}`}>
                      <td scope="row" className="row">
                        <div className="col col-md-5">
                          <div class="row" onClick={openProfile}>
                            <div class="col-auto h1">
                              <i className="bi bi-person-circle clickable"></i>
                            </div>
                            <div class="col px-0 d-flex flex-column justify-content-center">
                              <h6 className="mb-0 clickable">
                                {applicant.fullName}
                              </h6>
                              <small class="text-muted">
                                Applied {applicant.createdAt}
                                <i className="bi bi-dot"></i>
                                {applicant.state}
                              </small>
                            </div>
                          </div>
                          <div className="row">
                            <small>
                              <div className="col text-muted">
                                <div className="row mt-1">
                                  <di>
                                    {applicant.applicant_remarks ? (
                                      <div>
                                        <i class="bi bi-chat-text me-1"></i>{' '}
                                        {applicant.applicant_remarks.length >
                                        30 ? (
                                          <span>
                                            {remarksExpanded[index]
                                              ? applicant.applicant_remarks
                                              : `${applicant.applicant_remarks.substring(
                                                  0,
                                                  30
                                                )}...`}
                                            <span
                                              class="clickable text-primary ms-1"
                                              onClick={() => {
                                                setRemarksExpanded({
                                                  ...remarksExpanded,
                                                  [index]:
                                                    !remarksExpanded[index],
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
                                          <span>
                                            {applicant.applicant_remarks}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </di>
                                </div>
                              </div>
                            </small>
                          </div>
                        </div>
                        <div className="col-lg col-md mt-3 mt-md-0">
                          <div className="row">
                            <div className="col">
                              <>
                                <small className="text-muted">
                                  Applied for
                                </small>
                                <br />
                                <small
                                  onClick={() => {
                                    if (jobPost) {
                                      setToggleModal({
                                        ...toggleModal,
                                        jobDetails: true,
                                      });
                                      setSelectedJob(jobPost);
                                    }
                                  }}
                                  class="clickable"
                                >
                                  {jobPost.title}
                                </small>
                              </>
                            </div>
                            <div className="col">
                              <>
                                <small className="text-muted">Status</small>
                                <br />
                                {applicant.application_action_status ==
                                'withdraw' ? (
                                  <small class="text-muted">
                                    Application Withdrawn
                                  </small>
                                ) : (
                                  <small
                                    class="clickable text-primary"
                                    onClick={() => {
                                      setToggleModal({
                                        ...toggleModal,
                                        application: true,
                                      });
                                      setSelectedApplication({
                                        applicant: applicant,
                                        jobPost: jobPost,
                                      });
                                    }}
                                  >
                                    {applicant.applicationStatusName}
                                  </small>
                                )}
                              </>
                            </div>
                            {/* <div className="col d-flex align-items-center">
                                <>
                                  {applicant.application_action_status ==
                                  'withdraw' ? (
                                    <span class="text-muted">
                                      Application Withdrawn
                                    </span>
                                  ) : (
                                    <div class="dropdown">
                                      <i
                                        class="bi bi-three-dots-vertical clickable "
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
                                              setSelectedApplication({
                                                applicant: applicant,
                                                jobPost: jobPost,
                                              });
                                            }}
                                          >
                                            New Status
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </>
                              </div> */}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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
