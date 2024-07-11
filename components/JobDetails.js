import LoadingSpinner from './LoadingSpinner';
import { useEffect, useState } from 'react';
import {
  COMPANY_SIZES,
  COUNTRIES,
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  PAGES,
  SALARY_TYPES,
} from '../utils/constants';
import moment from 'moment';
import GlobalButton from './GlobalButton';
import toast from 'react-hot-toast';
import { useApiCall } from '../context/apiCall';
import EmptyData from './EmptyData';
import { findInArray, getDisplayValue } from '../utils/helper';
import ShareJobModal from './ShareJobModal';
import { useModal } from '../context/modal';
import Link from 'next/link';
import { useTempData } from '../context/tempData';
import Image from 'next/image';

function JobDetails({ isLoading, showBtnExternalPage = true, item = null }) {
  const { toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const { apiData, updateJobPostViewsApi } = useApiCall();

  const [buttonConfig, setButtonConfig] = useState({
    apply: {
      isLoading: false,
    },
  });

  const logedIn = apiData.user.data?.id && !apiData.user.isLoading;
  const selectedJob = item ? item : tempData.selectedItem.jobDetails;

  const jobData = {
    isApplied: apiData.application.data.some(
      (job) => job.job_post_id === selectedJob?.id
    ),
    employmentType: EMPLOYMENT_TYPES.find(
      (type) => type.value === selectedJob?.employment_type
    )?.name,
    createdAt: moment(selectedJob?.created_at).fromNow(),
    company: selectedJob?.company_profile?.company_name || '-',
    companyUid: selectedJob?.company_profile?.uid,
    salary: selectedJob?.min_salary
      ? `RM ${selectedJob?.min_salary} -  ${selectedJob?.max_salary} ${
          SALARY_TYPES.find((type) => type.value === selectedJob?.salary_type)
            ?.name
        }`
      : 'Undisclosed',
    location: `${getDisplayValue(selectedJob?.company_profile, 'address_1')}${
      getDisplayValue(selectedJob?.company_profile, 'address_2', '')
        ? `, ${getDisplayValue(selectedJob?.company_profile, 'address_2')}`
        : ''
    }${
      getDisplayValue(selectedJob?.company_profile, 'city', '')
        ? `, ${getDisplayValue(selectedJob?.company_profile, 'city')}`
        : ''
    }${
      getDisplayValue(selectedJob?.company_profile, 'state', '')
        ? `, ${getDisplayValue(selectedJob?.company_profile, 'state')}`
        : ''
    }${
      selectedJob?.company_profile?.country
        ? getDisplayValue(
            findInArray(
              COUNTRIES,
              'value',
              selectedJob.company_profile.country
            ),
            'name',
            ''
          )
        : ''
    }`,
    requirements: selectedJob?.requirements ? selectedJob?.requirements : [],
    benefits: selectedJob?.benefits ? selectedJob?.benefits : [],
    additionalInfo: selectedJob?.additional_info || '',
    size: getDisplayValue(
      findInArray(COMPANY_SIZES, 'value', selectedJob?.company_profile?.size),
      'name',
      '-'
    ),
    registration_number:
      selectedJob?.company_profile?.registration_number || '-',
    industries:
      Array.isArray(
        getDisplayValue(selectedJob?.company_profile, 'industries')
      ) &&
      getDisplayValue(selectedJob?.company_profile, 'industries').map(
        (industry, index) =>
          INDUSTRIES.find((level) => level.value === industry)?.name ?? '-'
      ),
  };

  const updateViews = async (postId) => {
    if (postId) {
      await updateJobPostViewsApi({
        postId: postId,
      });
    }
  };

  useEffect(() => {
    updateViews(selectedJob?.id);
  }, [selectedJob]);

  return (
    <>
      <ShareJobModal />
      <div>
        {isLoading && <LoadingSpinner />}
        {!selectedJob && (
          <div class="vh-100">
            <EmptyData
              icon={
                <Image
                  src="/images/moving-forward-60.svg"
                  alt="image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: 100, height: 'auto' }}
                  class="d-inline-block align-text-top"
                />
              }
              title="Start Your Job Journey"
              description="Click on any job post for more details."
            />
          </div>
        )}
        {selectedJob && (
          <div>
            {selectedJob && (
              <div class="card-body">
                <div class="d-flex flex-wrap mb-2">
                  <div class="flex-grow-1 mb-1">
                    <h5 class="mb-0">
                      <strong class="card-title h3">
                        {selectedJob?.title}
                      </strong>
                    </h5>
                    <div>
                      <label class="small text-muted">
                        {jobData.employmentType}
                      </label>
                      <i class="bi bi-dot"></i>
                      <label class="small text-muted">
                        {jobData.createdAt}
                      </label>
                    </div>
                  </div>
                  <div class="flex-shrink-0 mt-2 mt-md-0 text-md-right">
                    <GlobalButton
                      btnType="button"
                      btnClass={`btn ${
                        jobData.isApplied
                          ? 'btn-outline-success'
                          : 'btn-primary'
                      } me-1`}
                      btnLoading={buttonConfig.apply.isLoading}
                      btnOnClick={() => {
                        if (logedIn) {
                          if (
                            apiData.profile.data?.account_type !== 'job_seeker'
                          ) {
                            toast.error(
                              'Oops! only job seekers can apply for jobs.'
                            );
                            return;
                          }
                          toggleModal('applyJob');
                          setValueTempData('selectedItem', {
                            ...tempData.selectedItem,
                            jobDetails: selectedJob,
                          });
                        } else {
                          toggleModal('auth');
                        }
                      }}
                    >
                      {jobData.isApplied ? (
                        <i class="bi bi-check-lg me-1"></i>
                      ) : (
                        ''
                      )}
                      {jobData.isApplied
                        ? 'Applied'
                        : logedIn
                        ? 'Apply this job'
                        : 'Apply this job'}
                    </GlobalButton>
                    {showBtnExternalPage ? (
                      <GlobalButton
                        btnType="button"
                        btnClass="btn btn-secondary me-1"
                        btnLoading={false}
                        btnOnClick={() => {
                          window.open(
                            `${PAGES.viewJob.directory}?jobId=${selectedJob.uid}`,
                            '_blank'
                          );
                        }}
                      >
                        <i class="bi bi-arrows-fullscreen"></i>
                      </GlobalButton>
                    ) : (
                      ''
                    )}
                    <GlobalButton
                      btnType="button"
                      btnClass="btn btn-secondary"
                      btnLoading={false}
                      btnOnClick={() => {
                        toggleModal('shareJob');
                        setValueTempData('links', {
                          ...tempData.links,
                          shareJobUrl: `${process.env.NEXT_PUBLIC_DOMAIN_URL}${PAGES.viewJob.directory}?jobId=${selectedJob.uid}`,
                        });
                      }}
                    >
                      <i class="bi bi-share-fill"></i>
                    </GlobalButton>
                  </div>
                </div>
                <div class="scroll-box">
                  <ul class="list-unstyled bg-light rounded-2 p-2 mt-2">
                    <li class="mb-3">
                      <label class="small text-muted">Salary</label>
                      <div class="mb-0">{jobData.salary}</div>
                    </li>
                    <li class="mb-3">
                      <label class="small text-muted">Benefits</label>
                      <div class="mb-0">
                        {jobData.benefits.map((selectedJob, index) => {
                          return (
                            <li key={index}>
                              <span style={{ marginRight: '0.5rem' }}>
                                &#8226;
                              </span>
                              {selectedJob}
                            </li>
                          );
                        })}
                      </div>
                    </li>
                    <li class="mb-3">
                      <label class="small text-muted">Requirements</label>
                      <div class="mb-0">
                        {jobData.requirements.map((selectedJob, index) => {
                          return (
                            <li key={index}>
                              <span style={{ marginRight: '0.5rem' }}>
                                &#8226;
                              </span>
                              {selectedJob}
                            </li>
                          );
                        })}
                      </div>
                    </li>
                    {jobData?.additionalInfo ? (
                      <li class="mb-3">
                        <label class="small text-muted">Additional Info</label>
                        <div class="mb-0">{jobData.additionalInfo}</div>
                      </li>
                    ) : (
                      ''
                    )}
                    <hr />
                    <li class="mb-3">
                      <label class="small text-muted">Company</label>
                      <div class="mb-0">
                        {jobData.company ? (
                          <Link
                            href={`${PAGES.profile.directory}?type=company&uid=${jobData.companyUid}`}
                            target="_blank"
                            class="nav-link clickable fw-bold"
                          >
                            {jobData.company}
                          </Link>
                        ) : (
                          ''
                        )}
                      </div>
                    </li>
                    <li class="mb-3">
                      <label class="small text-muted">
                        <i class="bi bi-geo-alt"></i> Location
                      </label>
                      <div class="mb-0">{jobData.location}</div>
                    </li>
                    <li class="mb-3">
                      <label class="small text-muted">
                        Registration Number
                      </label>
                      <div class="mb-0">{jobData.registration_number}</div>
                    </li>
                    <li class="mb-3">
                      <label class="small text-muted">Company Size</label>
                      <div class="mb-0">{jobData.size}</div>
                    </li>
                    <li class="mb-3">
                      <label class="small text-muted">Industries</label>
                      <div class="mb-0">
                        {jobData.industries.length > 0
                          ? jobData.industries.join(', ')
                          : ''}
                      </div>
                    </li>
                  </ul>
                </div>
                <Link
                  href={`${PAGES.profile.directory}?type=company&uid=${jobData.companyUid}`}
                  target="_blank"
                  class="nav-link mt-3"
                >
                  <h6
                    class="text-primary text-end"
                    data-lang-key="global.see_more"
                  >
                    More from {jobData.company}{' '}
                    <i class="bi bi-arrow-up-right-circle ms-1"></i>
                  </h6>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default JobDetails;
