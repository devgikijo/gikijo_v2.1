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
import { useTempData } from '../context/tempData';

const ShareJobModal = ({ show, setShow }) => {
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();

  const router = useRouter();

  const copyLink = () => {
    const inputField = document.getElementById('input-job-link');
    inputField.select();
    inputField.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(inputField.value);
    toast.success('Link copied to clipboard!');
  };

  const shareLinks = [
    {
      platform: 'Facebook',
      icon: 'bi bi-facebook',
      url: (url) =>
        `https://www.facebook.com/sharer/sharer.php?u=${tempData.links.shareJobUrl}`,
    },
    {
      platform: 'LinkedIn',
      icon: 'bi bi-linkedin',
      url: (url) =>
        `https://www.linkedin.com/shareArticle?url=${tempData.links.shareJobUrl}`,
    },
    {
      platform: 'Twitter',
      icon: 'bi bi-twitter-x',
      url: (url) =>
        `https://twitter.com/intent/tweet?url=${tempData.links.shareJobUrl}`,
    },
  ];

  const shareLink = (platform) => {
    const url = encodeURIComponent(`${window.location.origin}${router.asPath}`);
    const shareUrl = shareLinks
      .find((link) => link.platform === platform)
      .url(url);
    window.open(shareUrl, '_blank');
  };

  return (
    <>
      <Modal
        show={isModalOpen.shareJob}
        onHide={() => {
          toggleModal('shareJob');
          setValueTempData('links', {
            ...tempData.links,
            shareJobUrl: '',
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Social Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div class="mb-4">
              <label class="form-label">Share this link via</label>
              <div>
                {shareLinks.map((link, index) => (
                  <GlobalButton
                    key={index}
                    btnType="button"
                    btnClass="btn btn-outline-primary me-1"
                    btnOnClick={() => shareLink(link.platform)}
                  >
                    <i className={link.icon}></i>
                  </GlobalButton>
                ))}
              </div>
            </div>
            <div class="mb-4">
              <label htmlFor="input-job-link" class="form-label">
                Copy Link
              </label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  id="input-job-link"
                  readOnly
                  value={tempData.links.shareJobUrl}
                />
                <button
                  class="btn btn-primary"
                  type="button"
                  onClick={() => {
                    copyLink();
                  }}
                >
                  <i class="bi bi-link-45deg"></i> Copy
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ShareJobModal;
