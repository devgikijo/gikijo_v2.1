import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyMessage from './EmptyMessage';
import {
  COMPANY_SIZES,
  COUNTRIES,
  CURRENT_JOB_STATUS,
  EMPLOYMENT_TYPES,
  GENDERS,
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
import { useRouter } from 'next/router';
import ResumeModal from './ResumeModal';
import { title } from 'process';

function ProfileJobSeeker({ isLoading, isEmpty, item, onSuccessFunction }) {
  const router = useRouter();
  const { apiData } = useApiCall();
  const { isModalOpen, toggleModal } = useModal();
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

  const jobSeekerProfileConfig = {
    fullName: {
      title: 'Full Name',
      value: getDisplayValue(item, 'full_name'),
    },
    accountType: {
      title: 'Account Type',
      value: 'Job Seeker',
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

  const detailsConfig1 = {
    currentJobStatus: {
      title: 'Current Job Status',
      value: getDisplayValue(
        findInArray(CURRENT_JOB_STATUS, 'value', item?.current_job_status),
        'name',
        ''
      ),
    },
    preferredJob: {
      title: 'Preferred Job',
      value: getDisplayValue(item, 'preferred_job'),
    },
    expectedSalary: {
      title: 'Expected Salary',
      value: `${getDisplayValue(item, 'expected_min_salary')}${
        getDisplayValue(item, 'expected_max_salary')
          ? ` - ${getDisplayValue(item, 'expected_max_salary')}`
          : ''
      } ${getDisplayValue(
        findInArray(SALARY_TYPES, 'value', item?.expected_salary_type),
        'name',
        ''
      )}`,
    },
  };

  const detailsConfig2 = {
    // aboutMe: {
    //   title: 'About Me',
    //   value: getDisplayValue(item, 'about_me'),
    // },
    gender: {
      title: 'Gender',
      value: getDisplayValue(
        findInArray(GENDERS, 'value', item?.gender),
        'name',
        ''
      ),
    },
    dateOfBirth: {
      title: 'Date of Birth',
      value: getDisplayValue(item, 'date_of_birth'),
    },
    phoneNumber: {
      title: 'Phone Number',
      value: getDisplayValue(item, 'phone_number'),
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

  const detailsConfig3 = {
    workExperiences: {
      // title: 'Work Experiences',
      value: Array.isArray(getDisplayValue(item, 'work_experience')) ? (
        <ul>
          {getDisplayValue(item, 'work_experience').map((work) => {
            if (work?.job_title) {
              return (
                <li key={work.job_title}>
                  {work.job_title} at {work.company_name} ({work.start_date} -{' '}
                  {work.end_date})
                  <br />
                  Responsibilities: {work?.responsibilities ?? ''}
                </li>
              );
            }
            return '-';
          })}
        </ul>
      ) : (
        getDisplayValue(item, 'work_experience')
      ),
    },
  };

  const detailsConfig4 = {
    educationBackground: {
      // title: 'Education Background',
      value: Array.isArray(getDisplayValue(item, 'education_background')) ? (
        <ul>
          {getDisplayValue(item, 'education_background').map((edu) => {
            if (edu?.institution_name) {
              return (
                <li key={edu.institution_name}>
                  {edu.institution_name}
                  {edu.field_of_study && `, ${edu.field_of_study}`}
                  {edu.start_date && ` (${edu.start_date} - ${edu.end_date})`}
                </li>
              );
            }
            return '-';
          })}
        </ul>
      ) : (
        getDisplayValue(item, 'education_background')
      ),
    },
  };

  const detailsConfig5 = {
    skills: {
      // title: 'Skills',
      value: Array.isArray(getDisplayValue(item, 'skills')) ? (
        <ul>
          {getDisplayValue(item, 'skills').map((skills) => {
            if (skills?.name) {
              return (
                <li key={skills.name}>
                  {`${skills.name} - ${
                    SKILL_LEVELS.find((level) => level.value === skills.level)
                      ?.name ?? '-'
                  }`}
                </li>
              );
            }
            return '-';
          })}
        </ul>
      ) : (
        getDisplayValue(item, 'skills')
      ),
    },
  };

  const detailsConfig6 = {
    languages: {
      // title: 'Languages',
      value: Array.isArray(getDisplayValue(item, 'languages')) ? (
        <ul>
          {getDisplayValue(item, 'languages').map((language) => {
            if (language?.name) {
              return (
                <li key={language.name}>
                  {`${language.name} - ${
                    LANGUAGE_LEVELS.find(
                      (level) => level.value === language.level
                    )?.name ?? '-'
                  }`}
                </li>
              );
            }
            return '-';
          })}
        </ul>
      ) : (
        getDisplayValue(item, 'languages')
      ),
    },
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

  const checkIsOwnerResume = () => {
    let isOwnerResume = false;
    if (item?.uid && apiData.resume.data?.uid) {
      if (item.uid === apiData.resume.data.uid) {
        isOwnerResume = true;
      }
    }
    return isOwnerResume;
  };

  const displayItem = ({ title = '', section = '', config = null }) => {
    const handleEditClick = () => {
      toggleModal('editResume');
      setModalConfig({ title, section });
    };

    return (
      <>
        {checkIsOwnerResume() && (
          <div class="d-flex">
            <strong class="flex-grow-1 text-muted">{title}</strong>
            <span class="text-primary clickable" onClick={handleEditClick}>
              <i class="bi bi-pencil"></i>
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
      <ResumeModal
        section={modalConfig.section}
        title={modalConfig.title}
        onSuccessFunction={() => {
          onSuccessFunction();
          toggleModal('editResume');
        }}
      />
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <div class="text-center mb-4">
              <div>
                <div class="col-auto">
                  <i class="fs-1 bi-person-circle"></i>
                </div>
                <div class="col my-auto">
                  <h5 class="mb-0">
                    <strong class="card-title h3">
                      {jobSeekerProfileConfig.fullName.value}
                    </strong>
                  </h5>
                  <div>
                    <small class="text-muted">
                      {jobSeekerProfileConfig.accountType.value}
                    </small>
                    <i class="bi bi-dot"></i>
                    <small class="text-muted">
                      {jobSeekerProfileConfig.country.value}
                    </small>
                  </div>
                </div>
              </div>
              {checkIsOwnerResume() && (
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
              )}
            </div>
            {displayItem({
              title: 'Job Details',
              section: 'jobDetails',
              config: detailsConfig1,
            })}
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
                                My Profile
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
                                title: 'Personal Info',
                                section: 'personalDetails',
                                config: detailsConfig2,
                              })}
                              {displayItem({
                                title: 'Work Experience',
                                section: 'workExperience',
                                config: detailsConfig3,
                              })}
                              {displayItem({
                                title: 'Education History',
                                section: 'educationHistory',
                                config: detailsConfig4,
                              })}
                              {displayItem({
                                title: 'Skills',
                                section: 'skills',
                                config: detailsConfig5,
                              })}
                              {displayItem({
                                title: 'Languages',
                                section: 'languages',
                                config: detailsConfig6,
                              })}
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

export default ProfileJobSeeker;
