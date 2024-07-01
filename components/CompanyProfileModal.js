import Modal from 'react-bootstrap/Modal';
import { useModal } from '../context/modal';
import CompanyProfileForm from './CompanyProfileForm';

const CompanyProfileModal = ({
  section = null,
  title = '',
  onSuccessFunction = null,
}) => {
  const { isModalOpen, toggleModal } = useModal();

  const handleClose = () => {
    toggleModal('editCompanyProfile');
  };

  return (
    <>
      <Modal show={isModalOpen.editCompanyProfile} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CompanyProfileForm
            section={section}
            onSuccessFunction={onSuccessFunction}
          />
        </Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    </>
  );
};

export default CompanyProfileModal;
