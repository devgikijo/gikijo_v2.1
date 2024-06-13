import Modal from 'react-bootstrap/Modal';
import { useModal } from '../context/modal';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { PAGES } from '../utils/constants';
import GlobalButton from './GlobalButton';
import { useApiCall } from '../context/apiCall';

const ForgotPasswordModal = () => {
  const { isModalOpen, toggleModal } = useModal();
  const { resetPasswordApi } = useApiCall();

  const [buttonConfig, setButtonConfig] = useState({
    resetPassword: {
      isLoading: false,
    },
  });

  const onSubmitForgotPassword = async (event) => {
    event.preventDefault();

    setButtonConfig({
      ...buttonConfig,
      resetPassword: {
        ...buttonConfig.resetPassword,
        isLoading: true,
      },
    });

    const result = await resetPasswordApi({
      currentEmail: document.getElementById('input-current-email').value,
    });

    if (result) {
      toast.success(
        'An email to reset your password has been sent. Please check your inbox for further instructions.',
        {
          duration: 6000,
        }
      );
      toggleModal('forgotPassword');
    }

    setButtonConfig({
      ...buttonConfig,
      resetPassword: {
        ...buttonConfig.signup,
        isLoading: false,
      },
    });
  };

  return (
    <>
      <Modal
        show={isModalOpen.forgotPassword}
        onHide={() => {
          toggleModal('forgotPassword');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitForgotPassword}>
            <p>
              To reset your password, please enter the email address associated
              with your account and we'll send you a link to reset your
              password.
            </p>
            <div class="mb-4">
              <label htmlFor="input-current-email" class="form-label">
                Email
              </label>
              <input
                type="email"
                class="form-control"
                id="input-current-email"
                required
              />
            </div>
            <div class="d-grid gap-2">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary"
                btnTitle="Reset Password"
                btnLoading={buttonConfig.resetPassword.isLoading}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
