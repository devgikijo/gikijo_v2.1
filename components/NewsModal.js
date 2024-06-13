import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useModal } from '../context/modal';
import Image from 'next/image';
import GlobalButton from './GlobalButton';
import AnimatedComponent from './AnimatedComponent';

const NewsModal = () => {
  const { isModalOpen, toggleModal } = useModal();
  const [currentView, setCurrentView] = useState(0);
  const [animationType, setAnimationType] = useState('swipeRight');

  const viewConfig = [
    {
      imageSrc: '/images/new-dashboard.png',
      title: 'Great News!',
      description: `We're excited to share that we've updated our website to improve your experience.`,
      navigation: { prev: null, next: 1 },
    },
    {
      imageSrc: '/images/new-dashboard.png',
      title: 'Fresh Design',
      description: `We've given our website a fresh new look, making it even more comfortable for your browsing.`,
      navigation: { prev: 0, next: 2 },
    },
    {
      imageSrc: '/images/new-dashboard.png',
      title: 'Faster Performance',
      description: `Our website now loads faster, now you won't have to wait long to see it.`,
      navigation: { prev: 1, next: 3 },
    },
    {
      imageSrc: '/images/new-dashboard.png',
      title: 'New Features',
      description: `We've also added some fantastic new features for you to explore.`,
      navigation: { prev: 2, next: 4 },
    },
    {
      imageSrc: '/images/new-dashboard.png',
      title: 'Give it a Try!',
      description: `Ready to experience our updated website?`,
      navigation: { prev: 3, next: null },
    },
  ];

  const handleNavigation = (direction) => {
    const nextView = viewConfig[currentView]?.navigation[direction];
    if (nextView !== null && nextView !== undefined) {
      setCurrentView(nextView);
      setAnimationType(direction === 'next' ? 'swipeRight' : 'swipeLeft');
    }
  };

  return (
    <>
      <Modal
        show={isModalOpen.news}
        onHide={() => {
          toggleModal('news');
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
          <AnimatedComponent stageIndex={currentView} type={animationType}>
            <Image
              src={viewConfig[currentView].imageSrc}
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 100, height: 'auto' }}
              class="d-block w-100 rounded"
            />
            <div className="text-center mt-3">
              <strong>{viewConfig[currentView].title}</strong>
              <p className="mt-2 mb-0">{viewConfig[currentView].description}</p>
            </div>
          </AnimatedComponent>
          <div className="d-flex justify-content-center">
            {viewConfig.map((view, index) => (
              <i
                key={index}
                className={`bi bi-dot dot-indicator ${
                  index === currentView ? 'active-dot-indicator' : ''
                }`}
                onClick={() => {
                  const direction = index > currentView ? 'next' : 'prev';
                  handleNavigation(direction);
                }}
              ></i>
            ))}
          </div>
          <div className="d-flex gap-2">
            <GlobalButton
              btnType="button"
              btnClass="btn btn-outline-secondary btn-lg flex-grow-1"
              btnTitle="Back"
              btnOnClick={() => {
                handleNavigation('prev');
              }}
              btnLoading={viewConfig[currentView].navigation.prev === null}
              btnHideLoading={true}
            />
            <GlobalButton
              btnType="submit"
              btnClass="btn btn-primary btn-lg flex-grow-1"
              btnTitle={currentView == 4 ? `Let's Go!` : 'Next'}
              btnOnClick={() => {
                if (currentView === 4) {
                  toggleModal('news');
                } else {
                  handleNavigation('next');
                }
              }}
              btnLoading={
                currentView == 4
                  ? false
                  : viewConfig[currentView].navigation.next === null
              }
              btnHideLoading={true}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewsModal;
