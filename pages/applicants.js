import { useState, useEffect, useRef } from 'react';
import SideBar from '../components/SideBar.js';
import JobPostModal from '../components/JobPostModal.js';
import PageHeader from '../components/PageHeader.js';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { APPLICATION_STATUS, IMAGES, PAGES } from '../utils/constants.js';
import Breadcrumb from '../components/BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import moment from 'moment';
import ApplicationModal from '../components/ApplicationModal.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import EmptyData from '../components/EmptyData.js';
import JobDetails from '../components/JobDetails.js';

const main = () => {
  const { apiData } = useApiCall();

  const [toggleModal, setToggleModal] = useState({
    application: false,
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleClose = (key) => {
    setToggleModal((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const Applicant = ({ applicant, jobData }) => {
    const openProfile = () => {
      window.open(
        `${PAGES.profile.directory}?type=resume&uid=${applicant.resume_uid}`,
        '_blank'
      );
    };

    return (
      <tr className="align-middle">
        <th scope="row" class="col-3">
          <div className="row">
            {/* <div className="col-auto clickable" onClick={openProfile}>
              <img
                className="rounded-circle border justify-content-center align-items-center avatar"
                src={IMAGES.applicant_placeholder.url}
                alt="Applicant Avatar"
              /> 
            </div> */}
            <div className="col">
              <div className="row">
                <div className="col clickable" onClick={openProfile}>
                  <i className="bi bi-person-circle clickable me-1"></i>{' '}
                  {applicant.fullName}
                </div>
              </div>
              <div className="row">
                <small>
                  <div className="col fw-light text-muted">
                    <small>
                      Applied {applicant.createdAt}
                      <i className="bi bi-dot"></i>
                      {applicant.state}
                    </small>
                    <div className="row mt-2">
                      <div>
                        <i className="bi bi-envelope me-1"></i>{' '}
                        {applicant.email}
                      </div>
                      <div>
                        <i className="bi bi-telephone me-1"></i>{' '}
                        {applicant.phoneNumber}
                      </div>
                    </div>
                  </div>
                </small>
              </div>
            </div>
          </div>
        </th>
        <td>
          <small className="fw-light">Applied for</small>
          <br />
          <span
            onClick={() => {
              if (jobData) {
                setToggleModal({
                  ...toggleModal,
                  jobDetails: true,
                });
                setSelectedJob(jobData);
              }
            }}
            class="clickable"
          >
            {jobData.title}
          </span>
          {applicant.applicant_remarks ? (
            <>
              <br />
              <span class="text-muted small">
                <i class="bi bi-chat-left-text me-1"></i>{' '}
                {applicant.applicant_remarks}
              </span>
            </>
          ) : (
            ''
          )}
        </td>
        <td>
          {applicant.application_action_status == 'withdraw' ? (
            <span class="text-muted">Application Withdrawn</span>
          ) : (
            <>
              <small className="fw-light">Action</small>
              <br />
              <strong
                className="text-primary fw-bold clickable"
                onClick={() => {
                  setToggleModal({
                    ...toggleModal,
                    application: true,
                  });
                  setSelectedApplication(applicant);
                }}
              >
                {applicant.applicationStatusName}{' '}
                <i className="bi bi-pencil clickable text-primary"></i>
              </strong>
              <br />
              {applicant.employer_remarks ? (
                <span class="text-muted small">
                  <i class="bi bi-chat-right-text me-1"></i>{' '}
                  {applicant.employer_remarks}
                </span>
              ) : (
                ''
              )}
            </>
          )}
        </td>
      </tr>
    );
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
        {!apiData.jobPost.isLoading && apiData.jobPost.data.length == 0 ? (
          <EmptyData
            icon={<i class="fs-5 bi-people"></i>}
            title="No applicant yet"
            description="Share your job listing on various social media sites to make it more visible."
          />
        ) : (
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
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
                    resume_uid: application.resume.uid,
                    id: application.id,
                    createdAt: moment(application.created_at).fromNow(),
                    fullName: application.resume.full_name,
                    email: application.resume.email,
                    phoneNumber: application.resume.phone_number,
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

                  return (
                    <Applicant
                      key={`${index}-${index2}`} // Assign a unique key using index values
                      applicant={applicant}
                      jobData={jobPost}
                    />
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
