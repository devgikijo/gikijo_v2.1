import { useState, useEffect } from 'react';
import SideBar from '../components/SideBar.js';
import JobPostModal from '../components/JobPostModal.js';
import PageHeader from '../components/PageHeader.js';
import { EMPLOYMENT_TYPES, PAGES } from '../utils/constants.js';
import Breadcrumb from '../components/BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import moment from 'moment';
import CompanyProfileModal from '../components/CompanyProfileModal.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import toast from 'react-hot-toast';
import EmptyData from '../components/EmptyData.js';
import JobPostTable from '../components/JobPostTable.js';
import { useModal } from '../context/modal.js';
import { useTempData } from '../context/tempData.js';

const main = () => {
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();

  const createPostButton = () => {
    return (
      <div class="col d-grid gap-2 d-md-flex justify-content-md-end">
        {/* <button class="btn btn-outline-primary btn-lg" type="button">
          <i class="bi bi-upload"></i> Bulk upload
        </button> */}
        <button
          class="btn btn-primary btn-lg"
          type="button"
          onClick={() => {
            toggleModal('jobPost');
            setValueTempData('selectedItem', {
              ...tempData.selectedItem,
              publishModalConfigType: 'create',
            });
          }}
        >
          <i class="bi bi-plus-lg"></i> Create Post
        </button>
      </div>
    );
  };

  return (
    <SideBar>
      <div class="container ps-0">
        <Breadcrumb page={PAGES.job_post} />
        <PageHeader
          title={PAGES.job_post.name}
          description={PAGES.job_post.description}
          rightContent={createPostButton()}
        />
        <JobPostTable />
      </div>
    </SideBar>
  );
};

export default main;
