import Modal from 'react-bootstrap/Modal';
import GlobalButton from './GlobalButton';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { APPLICATION_STATUS, PAGES } from '../utils/constants';
import { useApiCall } from '../context/apiCall';

const ApplicationModal = ({ toggleModal, setToggleModal, applicationData }) => {
  const { apiData, setMainData, editApplicationApi, addNotificationApi } =
    useApiCall();
  const [buttonConfig, setButtonConfig] = useState({
    submit: {
      isLoading: false,
    },
  });

  const handleClose = () => {
    setToggleModal((prevState) => ({
      ...prevState,
      application: false,
    }));
  };

  const formConfig = () => {
    const forms = {
      application: {
        application_status: document.getElementById(
          'select-applicantion-status'
        ),
        employer_remarks: document.getElementById('input-employer-remarks'),
      },
    };

    return forms;
  };

  useEffect(() => {
    if (applicationData) {
      for (const key in applicationData) {
        if (formConfig().application.hasOwnProperty(key)) {
          const element = formConfig().application[key];

          if (element?.type === 'checkbox') {
            if (applicationData[key]) {
              element.checked = true;
            } else {
              element.checked = false;
            }
          } else {
            element.value = applicationData[key];
          }
        }
      }
    }
  }, [applicationData, toggleModal.application]);

  const getKeyValue = () => {
    const keyValue = {};
    for (const key in formConfig().application) {
      const element = formConfig().application[key];
      if (element?.type === 'checkbox') {
        keyValue[key] = element.checked;
      } else {
        keyValue[key] = element.value;
      }
    }

    return keyValue;
  };

  const onSubmitApplication = async (event) => {
    event.preventDefault();

    setButtonConfig({
      ...buttonConfig,
      submit: {
        ...buttonConfig.submit,
        isLoading: true,
      },
    });

    const addData = getKeyValue();
    var success = false;

    const result = await editApplicationApi({
      postData: addData,
      id: applicationData.id,
    });

    if (result) {
      success = true;

      await addNotificationApi({
        message: 'Important: Application Status Change!',
        message_detail: `There's an update from the employer on your application status. Click here to check it out.`,
        action_url: PAGES.application.directory,
        action_title: 'View Status',
        user_uuid: applicationData.applicant_uuid,
        from_uuid: apiData.user.data?.id,
      });
    }

    setButtonConfig({
      ...buttonConfig,
      submit: {
        ...buttonConfig.submit,
        isLoading: false,
      },
    });

    if (success) {
      toast.success(
        'Status Updated!, we will notify the applicant about the latest change in their application status.',
        {
          duration: 6000,
        }
      );
      handleClose();

      const jobPost = apiData.jobPost.data;
      const newData = result;

      const postIndex = jobPost.findIndex(
        (post) => post.id === newData.job_post_id
      );

      if (postIndex !== -1) {
        const appIndex = jobPost[postIndex].application.findIndex(
          (app) => app.id === newData.id
        );

        if (appIndex !== -1) {
          const latestResult = jobPost[postIndex].application[appIndex];
          if (latestResult) {
            for (const key in latestResult) {
              if (formConfig().application.hasOwnProperty(key)) {
                latestResult[key] = newData[key];
              }
            }
          }

          setMainData((prevData) => ({
            ...prevData,
            jobPost: {
              ...prevData.jobPost,
              data: jobPost,
            },
          }));
        } else {
          console.log('Application not found in JobPost.');
        }
      } else {
        console.log('JobPost not found for the given job_post_id.');
      }
    }
  };

  return (
    <>
      <Modal show={toggleModal.application} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Status</Modal.Title>
        </Modal.Header>
        <form onSubmit={onSubmitApplication}>
          <Modal.Body>
            <div class="mb-3">
              <div class="col mb-3">
                <label htmlFor="select-applicantion-status" class="form-label">
                  Application Status
                </label>
                <select
                  class="form-select"
                  id="select-applicantion-status"
                  required
                >
                  {APPLICATION_STATUS.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div class="col mb-3">
                <label htmlFor="input-employer-remarks" class="form-label">
                  Remarks
                </label>
                <textarea
                  type="text"
                  class="form-control"
                  id="input-employer-remarks"
                  rows="3"
                  maxLength={300}
                  placeholder="Write additional comments or feedback for the applicant here..."
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <GlobalButton
              btnType="submit"
              btnClass="btn btn-primary btn-lg"
              btnTitle="Update"
              btnLoading={buttonConfig.submit.isLoading}
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ApplicationModal;
