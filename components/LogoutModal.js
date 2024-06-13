import Modal from 'react-bootstrap/Modal';
import { useModal } from '../context/modal';
import { useState } from 'react';
import GlobalButton from './GlobalButton';
import { useApiCall } from '../context/apiCall';

const LogoutModal = () => {
  const { isModalOpen, toggleModal } = useModal();
  const { logoutApi } = useApiCall();

  const [buttonConfig, setButtonConfig] = useState({
    logout: {
      isLoading: false,
    },
  });

  const onSubmitLogout = async (event) => {
    event.preventDefault();

    setButtonConfig({
      ...buttonConfig,
      logout: {
        ...buttonConfig.logout,
        isLoading: true,
      },
    });

    toggleModal('logout');
    logoutApi();

    setButtonConfig({
      ...buttonConfig,
      logout: {
        ...buttonConfig.signup,
        isLoading: false,
      },
    });
  };

  return (
    <>
      <Modal
        show={isModalOpen.logout}
        onHide={() => {
          toggleModal('logout');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitLogout}>
            <div class="mb-4">
              <p>
                You are attempting to logout your Gikijo account. Are you sure
                you want to logout?
              </p>
            </div>
            <div class="d-grid gap-2">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary"
                btnTitle="Yes, logout"
                btnLoading={buttonConfig.logout.isLoading}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LogoutModal;
