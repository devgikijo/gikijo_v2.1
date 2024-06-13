import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { useModal } from '../context/modal';
import { useState } from 'react';
import GlobalButton from './GlobalButton';
import { useApiCall } from '../context/apiCall';
import { useRouter } from 'next/router';
import { useTempData } from '../context/tempData';
import { PAGES } from '../utils/constants';

const ApplyJobModal = () => {
  const { isModalOpen, toggleModal } = useModal();
  const { apiData, addNotificationApi, applyJobPostApi } = useApiCall();
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
          <Modal.Title>Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="mb-4">
            <div class="text-muted small">
              <ul class="list-unstyled bg-light rounded-2 p-2 mt-2">
                <li class="mb-2">
                  <small class="text-muted">Apply to</small>
                  <p class="fw-bold mb-0 text-truncate">{selectedJob?.title}</p>
                  <p class="fw-bold mb-0 text-truncate">
                    by {selectedJob?.company_profile?.company_name}
                  </p>
                </li>
                <hr />
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
                placeholder="What makes you the best candidate for this position?"
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
