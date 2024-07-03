import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useModal } from '../context/modal';
import Image from 'next/image';
import GlobalButton from './GlobalButton';
import { useRouter } from 'next/router';

const OrderStatusModal = () => {
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();
  const [currentView, setCurrentView] = useState('success');

  const viewConfig = {
    success: {
      imageSrc: '/images/message-received.svg',
      title: 'Thank you!',
      description: 'Check the sending status in your post history.',
    },
  };

  useEffect(() => {
    if (router.query?.orderStatus == 'true') {
      setTimeout(() => {
        const { orderStatus, ...restQuery } = router.query;
        router.replace({
          pathname: router.pathname,
          query: restQuery,
        });
      }, 5000);
    }
  }, [router.query]);

  return (
    <>
      <Modal
        show={isModalOpen.orderStatus}
        onHide={() => {
          toggleModal('orderStatus');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <a class="navbar-brand" href="/">
              <Image
                src="/images/gikijo-logo.png"
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 100, height: 'auto' }}
                class="d-inline-block align-text-top"
                priority={true}
              />
            </a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="text-center my-4">
            <Image
              src={viewConfig[currentView].imageSrc}
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 100, height: 'auto' }}
              class="d-inline-block align-text-top"
            />
            <div class="mt-3">
              <strong class="h4">{viewConfig[currentView].title}</strong>
              <p className="mt-2 mb-0 text-muted">
                {viewConfig[currentView].description}
              </p>
            </div>
          </div>
          <div className="d-flex mt-5">
            <GlobalButton
              btnType="button"
              btnClass="btn btn-primary btn-lg flex-grow-1"
              btnTitle="Okay"
              btnOnClick={() => {
                toggleModal('orderStatus');
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderStatusModal;
