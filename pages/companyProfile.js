import { useState, useEffect } from 'react';
import SideBar from '../components/SideBar.js';
import JobPostModal from '../components/JobPostModal.js';
import PageHeader from '../components/PageHeader.js';
import {
  COMPANY_SIZES,
  COUNTRIES,
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  PAGES,
} from '../utils/constants.js';
import Breadcrumb from '../components/BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import moment from 'moment';
import CompanyProfileModal from '../components/CompanyProfileModal.js';
import EmptyData from '../components/EmptyData.js';
import { useModal } from '../context/modal.js';
import CompanyProfileTable from '../components/CompanyProfileTable.js';
import { useRouter } from 'next/router.js';
import CompanyProfileForm from '../components/CompanyProfileForm.js';

const main = () => {
  const router = useRouter();
  const { apiData } = useApiCall();

  const createCompanyButton = () => {
    return (
      <div class="col d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          class="btn btn-primary btn-lg"
          type="button"
          onClick={() => {
            if (apiData.companyProfile?.data?.uid) {
              router.push(
                `${PAGES.profile.directory}?type=company&uid=${apiData.companyProfile.data?.uid}`
              );
            }
          }}
        >
          <i class="fs-5 bi-building me-1"></i> View Profile{' '}
          <i class="bi bi-arrow-right-short"></i>
        </button>
      </div>
    );
  };

  return (
    <SideBar>
      <div class="container ps-0">
        <Breadcrumb page={PAGES.company_profile} />
        <PageHeader
          title={PAGES.company_profile.name}
          description={PAGES.company_profile.description}
          rightContent={createCompanyButton()}
        />
        <CompanyProfileForm />
      </div>
    </SideBar>
  );
};

export default main;
