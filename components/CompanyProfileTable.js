import { useState, useEffect } from 'react';
import SideBar from './SideBar.js';
import JobPostModal from './JobPostModal.js';
import PageHeader from './PageHeader.js';
import {
  COMPANY_SIZES,
  COUNTRIES,
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  PAGES,
} from '../utils/constants.js';
import Breadcrumb from './BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import LoadingSpinner from './LoadingSpinner.js';
import moment from 'moment';
import CompanyProfileModal from './CompanyProfileModal.js';
import EmptyData from './EmptyData.js';
import { useModal } from '../context/modal.js';
import { useTempData } from '../context/tempData.js';
import { useRouter } from 'next/router.js';

const CompanyProfileTable = () => {
  const { apiData } = useApiCall();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const router = useRouter();

  return (
    <>
      <CompanyProfileModal />
      <div>
        <LoadingSpinner isLoading={apiData.companyProfile.isLoading} />
        {!apiData.companyProfile.isLoading &&
        apiData.companyProfile.data.length == 0 ? (
          <EmptyData
            icon={<i class="fs-5 bi-building"></i>}
            title="No company yet"
            description="Add your first company today!"
          />
        ) : (
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {apiData.companyProfile.data?.map((item, index) => {
                const data = {
                  name: item.company_name,
                  createdAt: moment(item.created_at).fromNow(),
                  registration_number: item.registration_number,
                  size: COMPANY_SIZES.find((type) => type.value === item.size)
                    ?.name,
                  country: COUNTRIES.find((type) => type.value === item.country)
                    ?.name,
                  actionBtn: () => {
                    router.push(
                      `${PAGES.profile.directory}?type=company&uid=${item.uid}`
                    );
                  },
                };

                return (
                  <tr class="align-middle" key={index}>
                    <th scope="row">
                      {data.name}{' '}
                      <small
                        onClick={() => {
                          toggleModal('companyProfile');
                          setValueTempData('selectedItem', {
                            ...tempData.selectedItem,
                            editCompanyProfile: item,
                          });
                        }}
                      >
                        <i class="bi bi-pencil clickable text-primary"></i>
                      </small>
                      <p class="card-text fw-light">
                        <small class="text-muted">
                          {data.registration_number}
                          <i class="bi bi-dot"></i>
                          {data.createdAt}
                        </small>
                      </p>
                    </th>
                    <td>
                      <small class="text-mutedx">{data.size}</small>
                    </td>
                    <td>
                      <small class="text-muted">{data.country}</small>
                    </td>
                    <td>
                      <strong
                        class="text-primary fw-bold clickable"
                        onClick={data.actionBtn}
                      >
                        View Live
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CompanyProfileTable;
