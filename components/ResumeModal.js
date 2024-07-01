import Modal from 'react-bootstrap/Modal';
import { useModal } from '../context/modal';
import ResumeForm from './ResumeForm';

const ResumeModal = ({
  section = null,
  title = '',
  onSuccessFunction = null,
}) => {
  const { isModalOpen, toggleModal } = useModal();

  const handleClose = () => {
    toggleModal('editResume');
  };

  return (
    <>
      <Modal show={isModalOpen.editResume} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ResumeForm section={section} onSuccessFunction={onSuccessFunction} />
        </Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    </>
  );
};

export default ResumeModal;
