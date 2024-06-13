import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyMessage from './EmptyMessage';
import {
  COMPANY_SIZES,
  COUNTRIES,
  CURRENT_JOB_STATUS,
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  LANGUAGE_LEVELS,
  PAGES,
  SALARY_TYPES,
  SKILL_LEVELS,
} from '../utils/constants';
import moment from 'moment';
import GlobalButton from './GlobalButton';
import Offcanvas from 'react-bootstrap/Offcanvas';
import toast from 'react-hot-toast';
import { useApiCall } from '../context/apiCall';
import JobList from './JobList';
import JobDetails from './JobDetails';
import { useModal } from '../context/modal';
import CompanyProfileModal from './CompanyProfileModal';
import { useRouter } from 'next/router';

function ProfileEmployer({ isLoading, isEmpty, item, onSuccessFunction }) {
  const { isModalOpen, toggleModal } = useModal();
  const { apiData } = useApiCall();
  const router = useRouter();
  const [modalConfig, setModalConfig] = useState({
    title: '',
    section: '',
  });

  const findInArray = (array, property, value) => {
    return array.find((item) => item[property] === value);
  };

  const getDisplayValue = (item, property, defaultValue = '-') => {
    return item?.[property] ?? defaultValue;
  };

  const profileConfig = {
    companyName: {
      title: 'Company Name',
      value: getDisplayValue(item, 'company_name'),
    },
    accountType: {
      title: 'Account Type',
      value: 'Company',
    },
    country: {
      title: 'Country',
      value: getDisplayValue(
        findInArray(COUNTRIES, 'value', item?.country),
        'name',
        ''
      ),
    },
  };

  const companyDetailsConfig = {
    aboutUs: {
      title: 'About Us',
      value: getDisplayValue(item, 'about_us'),
    },
    industries: {
      title: 'Industries',
      value: Array.isArray(getDisplayValue(item, 'industries')) ? (
        <ul>
          {getDisplayValue(item, 'industries').map((industries, index) => {
            return (
              <li key={index}>
                {INDUSTRIES.find((level) => level.value === industries)?.name ??
                  '-'}
              </li>
            );
          })}
        </ul>
      ) : (
        ''
      ),
    },
    companySize: {
      title: 'Company Size',
      value: getDisplayValue(
        findInArray(COMPANY_SIZES, 'value', item?.size),
        'name',
        ''
      ),
    },
  };

  const companyDetailsConfig2 = {
    registrationNumber: {
      title: 'Registration Number',
      value: getDisplayValue(item, 'registration_number'),
    },
    website: {
      title: 'Website',
      value: getDisplayValue(item, 'website'),
    },
    address: {
      title: 'Address',
      value: `${getDisplayValue(item, 'address_1')}${
        getDisplayValue(item, 'address_2')
          ? `, ${getDisplayValue(item, 'address_2')}`
          : ''
      }${
        getDisplayValue(item, 'city')
          ? `, ${getDisplayValue(item, 'city')}`
          : ''
      }${
        getDisplayValue(item, 'state')
          ? `, ${getDisplayValue(item, 'state')}`
          : ''
      }, ${getDisplayValue(
        findInArray(COUNTRIES, 'value', item?.country),
        'name',
        ''
      )}`,
    },
  };

  const companyJobsConfig = {
    jobs: item?.job_post ?? [],
  };

  const mapValue = (data) => {
    const entries = Object.entries(data);

    return entries.map(([key, value], index) => {
      const isLastItem = index === entries.length - 1;
      const itemClass = isLastItem ? '' : 'mb-3';

      return (
        <li className={itemClass} key={key}>
          {value?.title && (
            <label className="small text-muted">{value.title}</label>
          )}
          <div className="mb-0 text-truncate">{value.value}</div>
        </li>
      );
    });
  };

  const displayItem = ({ title = '', section = '', config = null }) => {
    let isOwner = false;

    if (item?.user_uuid && apiData.user?.data?.id) {
      if (item?.user_uuid === apiData.user.data.id) {
        isOwner = true;
      }
    }

    const handleEditClick = () => {
      toggleModal('editCompanyProfile');
      setModalConfig({ title, section });
    };

    return (
      <>
        {isOwner && (
          <div class="d-flex">
            <strong class="flex-grow-1 text-muted">{title}</strong>
            <span class="text-primary clickable" onClick={handleEditClick}>
              <i class="bi bi-pencil me-1"></i> Edit
            </span>
          </div>
        )}
        <div>
          <ul class="list-unstyled bg-light rounded-2 p-2 mt-2">
            {mapValue(config)}
          </ul>
        </div>
      </>
    );
  };

  return (
    <div class="row">
      <CompanyProfileModal
        section={modalConfig.section}
        title={modalConfig.title}
        onSuccessFunction={() => {
          onSuccessFunction();
          toggleModal('editCompanyProfile');
        }}
      />
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <div class="text-center mb-4">
              <div>
                <div class="col-auto">
                  <i class="fs-1 bi-building"></i>
                </div>
                <div class="col my-auto">
                  <h5 class="mb-0">
                    <strong class="card-title h3">
                      {profileConfig.companyName.value}
                    </strong>
                  </h5>
                  <div>
                    <small class="text-muted">
                      {profileConfig.accountType.value}
                    </small>
                    <i class="bi bi-dot"></i>
                    <small class="text-muted">
                      {profileConfig.country.value}
                    </small>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <GlobalButton
                  btnType="button"
                  btnClass="btn btn-primary w-100"
                  btnOnClick={() => {
                    router.push(PAGES.dashboard.directory);
                  }}
                >
                  <i class="bi-bar-chart-line px-2"></i> View Dashboard
                </GlobalButton>
              </div>
            </div>
            <div>
              {displayItem({
                title: 'Basic Info',
                section: 'basicInfo',
                config: companyDetailsConfig2,
              })}
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="mb-3 sticky-top sticky-top-padding">
          <div class="row">
            <div class="col">
              <div class="card mt-lg-0 mt-3">
                {isLoading && <LoadingSpinner />}
                {isEmpty && <EmptyMessage />}
                {!isEmpty && (
                  <div>
                    {item && (
                      <div class="card-body">
                        <div>
                          <nav>
                            <div
                              class="nav nav-tabs"
                              id="nav-tab"
                              role="tablist"
                            >
                              <button
                                class="nav-link active"
                                id="nav-profile-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-profile"
                                type="button"
                                role="tab"
                                aria-controls="nav-profile"
                                aria-selected="true"
                              >
                                Profile
                              </button>
                              <button
                                class="nav-link"
                                id="nav-jobs-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-jobs"
                                type="button"
                                role="tab"
                                aria-controls="nav-jobs"
                                aria-selected="true"
                              >
                                Jobs{' '}
                                {companyJobsConfig.jobs.length > 0 ? (
                                  <span class="badge bg-primary">
                                    {companyJobsConfig.jobs.length}
                                  </span>
                                ) : (
                                  ''
                                )}
                              </button>
                            </div>
                          </nav>
                          <div class="tab-content mt-4" id="nav-tabContent">
                            <div
                              class="tab-pane fade show active"
                              id="nav-profile"
                              role="tabpanel"
                              aria-labelledby="nav-profile-tab"
                            >
                              {displayItem({
                                title: 'Business Overview',
                                section: 'businessOverview',
                                config: companyDetailsConfig,
                              })}
                            </div>
                            <div
                              class="tab-pane fade"
                              id="nav-jobs"
                              role="tabpanel"
                              aria-labelledby="nav-jobs-tab"
                            >
                              <div>
                                <JobList />
                                <Offcanvas
                                  show={isModalOpen.jobDetails}
                                  onHide={() => {
                                    toggleModal('jobDetails');
                                  }}
                                  placement="end"
                                >
                                  <Offcanvas.Header
                                    closeButton
                                  ></Offcanvas.Header>
                                  <Offcanvas.Body>
                                    <JobDetails />
                                  </Offcanvas.Body>
                                </Offcanvas>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEmployer;
