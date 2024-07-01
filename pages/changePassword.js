import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import GlobalButton from '../components/GlobalButton';
import { PAGES } from '../utils/constants';
import { useApiCall } from '../context/apiCall';

const main = () => {
  const router = useRouter();
  const { updatePasswordApi } = useApiCall();

  const [buttonConfig, setButtonConfig] = useState({
    changePassword: {
      keyName: 'changePassword',
      submit: {
        isLoading: false,
      },
    },
  });

  const formConfig = () => {
    const forms = {
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

  return (
    <div className="body">
      <section class="container">
        <h1>Change your password</h1>
        <div class="md-5 col-md-7">
          <form
            onSubmit={(event) =>
              onSubmitChangePassword(event, buttonConfig.changePassword.keyName)
            }
          >
            <p>Enter a new password below to change your current password.</p>
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
                btnType="button"
                btnClass="btn btn-outline-primary btn-lg me-3"
                btnOnClick={() => {
                  router.push(PAGES.home.directory);
                }}
              >
                <i class="bi bi-arrow-left-short"></i>
                Back to Home
              </GlobalButton>
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Change Password"
                btnLoading={buttonConfig.changePassword.submit.isLoading}
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default main;
