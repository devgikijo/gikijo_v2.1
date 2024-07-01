import { useState, useEffect, useRef } from 'react';
import SideBar from '../components/SideBar.js';
import JobPostModal from '../components/JobPostModal.js';
import PageHeader from '../components/PageHeader.js';
import { IMAGES, PAGES } from '../utils/constants.js';
import Breadcrumb from '../components/BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import { useRouter } from 'next/router';
import ResumeForm from '../components/ResumeForm.js';

const main = () => {
  const { apiData } = useApiCall();
  const router = useRouter();

  const saveResumeButton = () => {
    return (
      <div class="col d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          class="btn btn-primary btn-lg"
          type="button"
          onClick={() => {
            if (apiData.resume?.data?.uid) {
              router.push(
                `${PAGES.profile.directory}?type=resume&uid=${apiData.resume?.data?.uid}`
              );
            }
          }}
        >
          <i class="fs-5 bi-person-circle me-1"></i> View Live{' '}
          <i class="bi bi-arrow-right-short"></i>
        </button>
      </div>
    );
  };

  return (
    <SideBar>
      <div class="container ps-0">
        <Breadcrumb page={PAGES.manage_profile} />
        <PageHeader
          title={PAGES.manage_profile.name}
          description={PAGES.manage_profile.description}
          rightContent={saveResumeButton()}
        />
        <ResumeForm />
      </div>
    </SideBar>
  );
};

export default main;
