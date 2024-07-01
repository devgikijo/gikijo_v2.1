import { useEffect, useState } from 'react';
import GlobalButton from './GlobalButton';
import toast from 'react-hot-toast';
import { useApiCall } from '../context/apiCall';
import { ACCOUNT_TYPES } from '../utils/constants';

const SettingsForm = () => {
  const {
    apiData,
    clearData,
    updateProfileApi,
    updatePasswordApi,
    deleteAccountApi,
  } = useApiCall();
  const DELETE_KEYWORD = 'DELETE';

  const [buttonConfig, setButtonConfig] = useState({
    myDetails: {
      keyName: 'myDetails',
      submit: {
        isLoading: false,
      },
    },
    changePassword: {
      keyName: 'changePassword',
      submit: {
        isLoading: false,
      },
    },
    deleteAccount: {
      keyName: 'deleteAccount',
      submit: {
        isLoading: false,
      },
    },
  });

  useEffect(() => {
    if (!apiData.profile.isLoading) {
      formConfig().my_details.full_name.value = apiData.profile.data.full_name;
      formConfig().my_details.username.value = apiData.profile.data.username;
      formConfig().my_details.email.value = apiData.profile.data.email;
      formConfig().my_details.account_type.value =
        apiData.profile.data.account_type;
    }
  }, [apiData.profile.data]);

  const formConfig = () => {
    const forms = {
      my_details: {
        full_name: document.getElementById('input-full-name'),
        username: document.getElementById('input-username'),
        email: document.getElementById('input-email'),
        account_type: document.getElementById('select-account-type'),
      },
      change_password: {
        new_password: document.getElementById('input-new-password'),
        confirm_password: document.getElementById('input-confirm-password'),
      },
      delete_account: {
        delete_account_confirmation: document.getElementById(
          'input-delete-account-confirmation'
        ),
      },
    };

    return forms;
  };

  const getKeyValue = (formName) => {
    if (formName) {
      const keyValue = {};
      for (const key in formConfig()[formName]) {
        const element = formConfig()[formName][key];
        if (element?.type === 'checkbox') {
          keyValue[key] = element.checked;
        } else if (element?.type === 'number') {
          if (element.value == '') {
            keyValue[key] = 0;
          } else {
            keyValue[key] = element.value;
          }
        } else {
          keyValue[key] = element.value;
        }
      }

      return keyValue;
    }
  };

  const onSubmitMyDetails = async (event, keyName) => {
    event.preventDefault();
    const addData = getKeyValue('my_details');

    setButtonConfig((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        submit: {
          ...prevState[keyName].submit,
          isLoading: true,
        },
      },
    }));

    await updateProfileApi({
      postData: addData,
      user_uuid: apiData.user.data?.id,
    });

    setButtonConfig((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        submit: {
          ...prevState[keyName].submit,
          isLoading: false,
        },
      },
    }));
  };

  const onSubmitChangePassword = async (event, keyName) => {
    event.preventDefault();
    const addData = getKeyValue('change_password');
    if (addData.new_password !== addData.confirm_password) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    setButtonConfig((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        submit: {
          ...prevState[keyName].submit,
          isLoading: true,
        },
      },
    }));

    await updatePasswordApi({
      postData: addData,
    });

    setButtonConfig((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        submit: {
          ...prevState[keyName].submit,
          isLoading: false,
        },
      },
    }));
  };

  const onSubmitDeleteAccount = async (event, keyName) => {
    event.preventDefault();
    const addData = getKeyValue('delete_account');
    if (addData.delete_account_confirmation !== DELETE_KEYWORD) {
      toast.error(
        'The confirmation code you entered is incorrect. Please try again.'
      );
      return;
    }

    setButtonConfig((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        submit: {
          ...prevState[keyName].submit,
          isLoading: true,
        },
      },
    }));

    const result = await deleteAccountApi({
      email: apiData.user.data?.email,
      reason: '',
    });

    if (result) {
      clearData();
    }

    setButtonConfig((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        submit: {
          ...prevState[keyName].submit,
          isLoading: false,
        },
      },
    }));
  };

  return (
    <div class="accordion" id="accordionPanelsStayOpenExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseOne"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            <strong>Account Info</strong>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body">
            <form
              onSubmit={(event) =>
                onSubmitMyDetails(event, buttonConfig.myDetails.keyName)
              }
            >
              <div class="col mb-3">
                <label htmlFor="input-full-name" class="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="input-full-name"
                  maxLength={50}
                  placeholder={apiData.profile.data?.full_name}
                />
              </div>
              <div class="col mb-3">
                <label htmlFor="input-username" class="form-label">
                  Username
                </label>
                <input
                  type="text"
                  class="form-control"
                  maxLength={20}
                  id="input-username"
                  required
                />
              </div>
              <div class="col mb-3">
                <label htmlFor="input-email" class="form-label">
                  Email
                </label>
                <input
                  disabled
                  type="email"
                  class="form-control"
                  id="input-email"
                  required
                />
              </div>
              <div class="col mb-3">
                <label htmlFor="select-account-type" class="form-label">
                  Account Type
                </label>
                <select
                  class="form-select"
                  id="select-account-type"
                  disabled
                  required
                >
                  {ACCOUNT_TYPES.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div class="d-flex justify-content-end">
                <GlobalButton
                  btnType="submit"
                  btnClass="btn btn-primary btn-lg"
                  btnTitle="Update My Details"
                  btnLoading={buttonConfig.myDetails.submit.isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseTwo"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseTwo"
          >
            <strong>Change Password</strong>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingTwo"
        >
          <div class="accordion-body">
            <form
              onSubmit={(event) =>
                onSubmitChangePassword(
                  event,
                  buttonConfig.changePassword.keyName
                )
              }
            >
              <div class="col mb-3">
                <label htmlFor="input-new-password" class="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="input-new-password"
                  required
                />
              </div>
              <div class="col mb-3">
                <label htmlFor="input-confirm-password" class="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="input-confirm-password"
                  required
                />
              </div>
              <div class="d-flex justify-content-end">
                <GlobalButton
                  btnType="submit"
                  btnClass="btn btn-primary btn-lg"
                  btnTitle="Change Password"
                  btnLoading={buttonConfig.changePassword.submit.isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingThree">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseThree"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseThree"
          >
            <strong>Delete Account</strong>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseThree"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingThree"
        >
          <div class="accordion-body">
            <form
              onSubmit={(event) =>
                onSubmitDeleteAccount(event, buttonConfig.deleteAccount.keyName)
              }
            >
              <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-1"></i> Permanently
                remove your account and all of its contents from Gikijo. This
                action is not reversible, so please continue with caution.
              </div>
              <div class="col mb-3">
                <label
                  htmlFor="input-delete-account-confirmation"
                  class="form-label"
                >
                  Type '{DELETE_KEYWORD}' to confirm
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="input-delete-account-confirmation"
                  required
                />
              </div>
              <div class="d-flex justify-content-end">
                <GlobalButton
                  btnType="submit"
                  btnClass="btn btn-danger btn-lg"
                  btnTitle="Delete Account"
                  btnLoading={buttonConfig.deleteAccount.submit.isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;
