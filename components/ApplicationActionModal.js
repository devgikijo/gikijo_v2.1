import Modal from 'react-bootstrap/Modal';
import GlobalButton from './GlobalButton';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { generateUniqueID } from '../utils/helper';
import DynamicSingleForm from './DynamicSingleForm';
import {
  APPLICATION_ACTION_STATUS,
  APPLICATION_STATUS,
  EMPLOYMENT_TYPES,
  SALARY_TYPES,
} from '../utils/constants';
import { useApiCall } from '../context/apiCall';

const ApplicationActionModal = ({
  toggleModal,
  setToggleModal,
  applicationData,
}) => {
  const { apiData, setMainData, editApplicationApi } = useApiCall();
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
        application_action_status: document.getElementById(
          'select-applicantion-action-status'
        ),
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
    }

    setButtonConfig({
      ...buttonConfig,
      submit: {
        ...buttonConfig.submit,
        isLoading: false,
      },
    });

    if (success) {
      toast.success('Save!');
      handleClose();

      const application = apiData.application.data;
      const newData = result;

      const itemIndex = application.findIndex((post) => post.id === newData.id);

      if (itemIndex !== -1) {
        application[itemIndex].application_action_status =
          newData.application_action_status;
        setMainData((prevData) => ({
          ...prevData,
          application: {
            ...prevData.application,
            data: application,
          },
        }));
      } else {
        console.log('Application not found for the given id.');
      }
    }
  };

  return (
    <>
      <Modal show={toggleModal.application} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Action</Modal.Title>
        </Modal.Header>
        <form onSubmit={onSubmitApplication}>
          <Modal.Body>
            <div class="mb-3">
              <label
                htmlFor="select-applicantion-action-status"
                class="form-label"
              >
                Action
              </label>
              <select
                class="form-select"
                id="select-applicantion-action-status"
                required
              >
                {APPLICATION_ACTION_STATUS.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <GlobalButton
              btnType="submit"
              btnClass="btn btn-primary btn-lg"
              btnTitle="Save"
              btnLoading={buttonConfig.submit.isLoading}
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ApplicationActionModal;
