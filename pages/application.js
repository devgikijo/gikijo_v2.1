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

const main = () => {
  const { apiData, getApplicationApi } = useApiCall();
  const [toggleModal, setToggleModal] = useState({
    application: false,
    jobDetails: false,
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

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
            icon={<i class="fs-5 bi-file-earmark-arrow-up"></i>}
            title="No application yet"
            description="Apply to jobs and track your applications status here."
          />
        ) : (
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
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
                  employerRemarks: item.employer_remarks,
                  applicantRemarks: item.applicant_remarks
                    ? item.applicant_remarks
                    : '-',
                };

                return (
                  <tr key={index}>
                    <th
                      scope="row"
                      class="col-4"
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
                      <span class="clickable">{data.title}</span>
                      <p class="card-text fw-light">
                        <small class="text-muted">
                          {data.employmentType}
                          <i class="bi bi-dot"></i>
                          Applied {data.createdAt}
                        </small>
                        {data.applicantRemarks ? (
                          <>
                            <br />
                            <span class="text-muted small">
                              <i class="bi bi-chat-left-text me-1"></i>{' '}
                              {data.applicantRemarks}
                            </span>
                          </>
                        ) : (
                          ''
                        )}
                      </p>
                    </th>
                    <td class="align-middle">
                      <small className="fw-light">Application Status</small>
                      <br />
                      {data.applicationStatusName}
                    </td>
                    <td
                      class="align-middle"
                      style={{ 'word-break': 'break-all' }}
                    >
                      <small className="fw-light">Employer Remarks</small>
                      <br />
                      {data.employerRemarks}
                    </td>
                    <td class="align-middle">
                      <small className="fw-light">Action</small>
                      <br />
                      <strong
                        className="text-primary fw-bold clickable"
                        onClick={() => {
                          setToggleModal({
                            ...toggleModal,
                            application: true,
                          });
                          setSelectedApplication(item);
                        }}
                      >
                        {data.applicationActionStatusName}{' '}
                        <i className="bi bi-pencil clickable text-primary"></i>
                      </strong>
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
