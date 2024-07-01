import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useModal } from '../context/modal';
import Image from 'next/image';
import GlobalButton from './GlobalButton';
import AnimatedComponent from './AnimatedComponent';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../utils/helper';

const NewsModal = () => {
  const { isModalOpen, toggleModal } = useModal();
  const [currentView, setCurrentView] = useState(0);
  const [animationType, setAnimationType] = useState('swipeRight');

  // change the ID_01 to something else to replace the current news
  const [seenNewsID_01, setSeenNewsID_01] = useLocalStorage(
    'seenNewsID_01',
    false
  );

  useEffect(() => {
    if (!seenNewsID_01) {
      setTimeout(() => {
        toggleModal('news');
      }, 500);
    }
  }, []);

  const viewConfig = [
    {
      icon: '🎉',
      imageSrc: '/images/new-dashboard.png',
      title: 'Great News!',
      description: `We're excited to share that we've updated our website to improve your browsing experience.`,
      navigation: { prev: null, next: 1 },
    },
    {
      icon: '✨',
      imageSrc: '/images/new-dashboard.png',
      title: 'Fresh Design',
      description: `We've given our website a fresh new look, making it even more comfortable for your browsing.`,
      navigation: { prev: 0, next: 2 },
    },
    {
      icon: '🚀',
      imageSrc: '/images/new-dashboard.png',
      title: 'Faster Performance',
      description: `Our website now loads faster, now you won't have to wait long to see it.`,
      navigation: { prev: 1, next: 3 },
    },
    {
      icon: '🪄',
      imageSrc: '/images/new-dashboard.png',
      title: 'New Features',
      description: `We've also added some fantastic new features for you to explore.`,
      navigation: { prev: 2, next: 4 },
    },
    {
      icon: '🙌',
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
            {/* <Image
              src={viewConfig[currentView].imageSrc}
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 100, height: 'auto' }}
              class="d-block w-100 rounded"
            /> */}
            <motion.div
              initial={{ rotate: 180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            >
              <div class="text-center">
                <h1 class="display-1">{viewConfig[currentView].icon}</h1>
              </div>
            </motion.div>
            <div className="text-center mt-3">
              <strong class="h4">{viewConfig[currentView].title}</strong>
              <p className="mt-2 mb-0 text-muted">
                {viewConfig[currentView].description}
              </p>
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
                  setSeenNewsID_01(true);
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
