import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { useModal } from '../context/modal';
import { useState } from 'react';
import GlobalButton from './GlobalButton';
import { useApiCall } from '../context/apiCall';
import { useRouter } from 'next/router';
import { useTempData } from '../context/tempData';
import { PAGES } from '../utils/constants';
import JobCard from './JobCard';

const ApplyJobModal = () => {
  const { isModalOpen, toggleModal } = useModal();
  const { apiData, addNotificationApi, applyJobPostApi, emailApplyJobPostApi } =
    useApiCall();
  const { tempData, setValueTempData } = useTempData();
  const router = useRouter();

  const [buttonConfig, setButtonConfig] = useState({
    apply: {
      isLoading: false,
    },
  });

  const selectedJob = tempData.selectedItem.jobDetails;
  const resumeDetails = apiData.resume.data;

  const onClickApply = async (item) => {
    if (apiData.profile.data?.account_type !== 'job_seeker') {
      toast.error('Oops! only job seekers can apply for jobs.');
      return;
    }

    if (!apiData.resume.data?.id) {
      toast.error('Resume not found!');
      return;
    }

    setButtonConfig({
      ...buttonConfig,
      apply: {
        ...buttonConfig.apply,
        isLoading: true,
      },
    });

    var success = false;

    const result = await applyJobPostApi({
      postData: {
        job_post_id: item.id,
        applicant_remarks: document.getElementById('input-applicant-remarks')
          .value,
      },
    });

    if (result) {
      success = true;

      await addNotificationApi({
        message: 'Application Submitted!',
        message_detail:
          'Your job application has been successfully submitted. We will notify the employer to review your application. Good luck with your job search!',
        action_url: PAGES.application.directory,
        action_title: 'View Status',
      });

      await emailApplyJobPostApi({
        postData: {
          job_post: item,
          applicant_remarks: document.getElementById('input-applicant-remarks')
            .value,
          applicant_name: apiData.resume.data?.full_name,
        },
      });
    }

    setButtonConfig({
      ...buttonConfig,
      apply: {
        ...buttonConfig.apply,
        isLoading: false,
      },
    });

    if (success) {
      toast.success(
        'Congratulations! Your application has been successfully submitted!',
        {
          duration: 6000,
        }
      );
    }

    toggleModal('applyJob');
  };

  return (
    <>
      <Modal
        show={isModalOpen.applyJob}
        onHide={() => {
          toggleModal('applyJob');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Apply this job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="mb-4">
            <JobCard item={selectedJob} displayOnly />
            {/* <div class="text-muted small">
              <ul class="list-unstyled bg-light rounded-2 p-2 mt-2">
                <li class="mb-2">
                  <small class="text-muted">Apply to</small>
                  <p class="fw-bold mb-0 text-truncate">{selectedJob?.title}</p>
                  <p class="fw-bold mb-0 text-truncate">
                    by {selectedJob?.company_profile?.company_name}
                  </p>
                </li>
                <li class="mb-2">
                  <small class="text-muted">With Profile</small>
                  <p class="fw-bold mb-0 text-truncate">
                    {resumeDetails.full_name}
                  </p>
                  ...
                  <small
                    class="text-primary clickable ms-1"
                    onClick={() => {
                      if (apiData.resume?.data?.uid) {
                        window.open(
                          `${PAGES.profile.directory}?type=resume&uid=${apiData.resume?.data?.uid}`,
                          '_blank'
                        );
                      }
                    }}
                  >
                    <strong>
                      more <i class="bi bi-arrow-up-right-circle ms-1"></i>
                    </strong>
                  </small>
                </li>
              </ul>
            </div> */}
            <div class="col mb-3">
              <label htmlFor="input-applicant-remarks" class="form-label">
                From
              </label>
              <div class="card clickable">
                <div class="card-body py-2">
                  <div
                    class="row"
                    onClick={() => {
                      if (apiData.resume?.data?.uid) {
                        window.open(
                          `${PAGES.profile.directory}?type=resume&uid=${apiData.resume?.data?.uid}`,
                          '_blank'
                        );
                      }
                    }}
                  >
                    <div class="col-auto h3 mb-0">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div class="col px-0 d-flex flex-column justify-content-center">
                      <span className="mb-0">{resumeDetails.full_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col mb-3">
              <label htmlFor="input-applicant-remarks" class="form-label">
                Remarks <span class="text-muted small">(optional)</span>
              </label>
              <textarea
                type="text"
                class="form-control"
                id="input-applicant-remarks"
                rows="3"
                maxLength={300}
                placeholder="Share why you're interested in this position.."
              />
            </div>
          </div>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <GlobalButton
              btnType="button"
              btnClass="btn btn-primary"
              btnTitle="Confirm & Apply"
              btnLoading={buttonConfig.apply.isLoading}
              btnOnClick={() => {
                onClickApply(selectedJob);
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ApplyJobModal;
