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
import { useTempData } from '../context/tempData.js';
import { useModal } from '../context/modal.js';
import GlobalButton from './GlobalButton.js';
import SendHistoryModal from './SendHistoryModal.js';
import { useRouter } from 'next/router.js';
import Image from 'next/image.js';
import { formatDisplayNumber } from '../utils/helper.js';

const JobPostTable = () => {
  const router = useRouter();
  const { apiData, publishJobPostApi } = useApiCall();
  const { tempData, setValueTempData } = useTempData();
  const { isModalOpen, toggleModal } = useModal();

  useEffect(() => {
    if (router.query?.createPost == 'true') {
      setTimeout(() => {
        toggleModal('jobPost');
        setValueTempData('selectedItem', {
          ...tempData.selectedItem,
          publishModalConfigType: 'create',
        });
      }, 1000);
    }

    if (router.query?.orderStatus == 'true') {
      setTimeout(() => {
        toggleModal('orderStatus');
      }, 1000);
    }
  }, [router.query]);

  return (
    <>
      <div>
        <LoadingSpinner isLoading={apiData.jobPost.isLoading} />
        {!apiData.jobPost.isLoading && apiData.jobPost.data.length == 0 ? (
          <div class="text-center mt-4">
            {apiData.profile.data?.onboarding == true ? (
              <EmptyData
                icon={
                  <Image
                    src="/images/marketing-51.svg"
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 100, height: 'auto' }}
                    class="d-inline-block align-text-top"
                  />
                }
                title="No post yet"
                description={
                  <div class="text-center">
                    <p>Click the button below to create your first job post.</p>
                    <GlobalButton
                      btnType="button"
                      btnClass="btn btn-primary me-2 mb-2"
                      btnOnClick={() => {
                        toggleModal('jobPost');
                        setValueTempData('selectedItem', {
                          ...tempData.selectedItem,
                          publishModalConfigType: 'create',
                        });
                      }}
                    >
                      <i class="bi bi-plus-lg me-1"></i> Create Post
                    </GlobalButton>
                  </div>
                }
              />
            ) : (
              <div>
                <div>
                  <Image
                    src="/images/marketing-51.svg"
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 150, height: 'auto' }}
                    class="d-inline-block align-text-top"
                  />
                </div>
                <GlobalButton
                  btnType="button"
                  btnClass="btn btn-primary btn-lg me-2 mb-2 mt-3"
                  btnOnClick={() => {
                    toggleModal('jobPost');
                    setValueTempData('selectedItem', {
                      ...tempData.selectedItem,
                      publishModalConfigType: 'create',
                    });
                  }}
                >
                  <i class="bi bi-plus-lg me-1"></i> Create Post
                </GlobalButton>
              </div>
            )}
          </div>
        ) : (
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {apiData.jobPost.data?.map((item, index) => {
                const { job_post_validity } = item;

                const isPublished = item?.job_post_validity?.is_published
                  ? true
                  : false;
                const publishedCount =
                  item?.job_post_validity?.published_channel?.length;

                const data = {
                  id: item.id,
                  title: item.title,
                  employmentType: EMPLOYMENT_TYPES.find(
                    (type) => type.value === item.employment_type
                  )?.name,
                  createdAt: job_post_validity?.created_at
                    ? `activated ${moment(
                        job_post_validity.created_at
                      ).fromNow()}`
                    : '',
                  expiredAt: job_post_validity?.expired_at
                    ? `expired ${moment(
                        job_post_validity.expired_at
                      ).fromNow()}`
                    : '',
                  viewCount: formatDisplayNumber(job_post_validity?.view_count),
                  shareCount: formatDisplayNumber(
                    job_post_validity?.share_count
                  ),
                  isSent: item?.job_post_send_que?.length > 0 ? true : false,
                  applicationCount: item.application?.length,
                  actionBtnApplicant: {
                    click: async () => {
                      router.push(PAGES.applicants.directory);
                    },
                    theme: {
                      color:
                        item.application?.length > 0
                          ? 'text-primary'
                          : 'text-muted',
                    },
                  },
                  actionBtn: {
                    click: async () => {
                      toggleModal('jobPost');
                      setValueTempData('selectedItem', {
                        ...tempData.selectedItem,
                        editJobDetails: item,
                        publishModalConfigType: 'share',
                      });
                    },
                    title: isPublished ? 'Channels' : 'Publish this job post',
                    theme: {
                      // color: isPublished ? 'text-secondary' : 'text-primary',
                      color: 'text-primary',
                    },
                  },
                  actionBtnHistory: {
                    click: async () => {
                      toggleModal('sendHistory');
                      setValueTempData('selectedItem', {
                        ...tempData.selectedItem,
                        editJobDetails: item,
                      });
                    },
                    title: isPublished ? 'Channels' : 'Publish this job post',
                    theme: {
                      // color: isPublished ? 'text-secondary' : 'text-primary',
                      color: 'text-primary',
                    },
                  },
                  theme: {
                    badge: isPublished
                      ? 'badge-status-success'
                      : 'badge-status-error',
                    icon: isPublished ? (
                      <i class="bi bi-check-circle me-1"></i>
                    ) : (
                      <i class="bi bi-exclamation-circle me-1"></i>
                    ),
                  },
                  // status: isPublished
                  // ? `${publishedCount > 10 ? '10+' : publishedCount} ${
                  //     publishedCount > 1 ? 'Channels' : 'Channel'
                  //   }`
                  // : 'unpublish',
                  status: isPublished ? 'Published' : 'Unpublish',
                  actionBtnStatus: {
                    click: async () => {
                      const resultPublish = await publishJobPostApi({
                        job_post_id: item.id,
                        is_published: !isPublished,
                      });

                      if (resultPublish?.data?.is_published == true) {
                        toast.success('Published!', {
                          duration: 5000,
                        });
                      }

                      if (resultPublish?.data?.is_published == false) {
                        toast.success('Unpublished!', {
                          duration: 5000,
                        });
                      }
                    },
                    icon: isPublished ? (
                      <i class="bi bi-arrow-counterclockwise ms-1"></i>
                    ) : (
                      <i class="bi bi-arrow-clockwise ms-1"></i>
                    ),
                  },
                  viewBtn: {
                    click: () => {
                      window.open(
                        `${PAGES.viewJob.directory}?jobId=${item.uid}`,
                        '_blank'
                      );
                    },
                  },
                };

                return (
                  <tr class="align-middle" key={index}>
                    <td class="row">
                      <div class="col col-md-5">
                        <div
                          onClick={() => {
                            toggleModal('jobPost');
                            setValueTempData('selectedItem', {
                              ...tempData.selectedItem,
                              editJobDetails: item,
                              publishModalConfigType: 'create',
                            });
                          }}
                          class="clickable"
                        >
                          <strong>{data.title}</strong>
                          <small class="mx-2">
                            <i class="bi bi-pencil text-primary me-1"></i>
                            <small class="text-primary">Edit</small>
                          </small>
                        </div>
                        <p class="card-text fw-light">
                          <small class="text-muted">
                            {data.employmentType}{' '}
                            {data.expiredAt && (
                              <>
                                <i class="bi bi-dot"></i> {data.expiredAt}
                              </>
                            )}
                          </small>
                        </p>
                      </div>
                      <div class="col-lg col-md">
                        <div class="row">
                          <div class="col-lg mt-3 mt-md-0">
                            <div class="row text-center">
                              <div class="col-auto">
                                <>
                                  <span
                                    class={`badge rounded-pill ${data.theme.badge}`}
                                  >
                                    <small>
                                      {data.theme.icon} {data.status}
                                    </small>
                                  </span>
                                  <small
                                    class="text-primary clickable"
                                    onClick={data.actionBtnStatus.click}
                                  >
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip>Publish/Unpublished</Tooltip>
                                      }
                                    >
                                      <span>{data.actionBtnStatus.icon}</span>
                                    </OverlayTrigger>
                                  </small>
                                </>
                              </div>
                              <div class="col">
                                <OverlayTrigger
                                  overlay={<Tooltip>Total Post Views</Tooltip>}
                                >
                                  <span class="text-muted">
                                    <i class="bi bi-eye"></i>{' '}
                                    {data.viewCount ?? 0}
                                  </span>
                                </OverlayTrigger>
                              </div>
                              <div class="col">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip>
                                      Total Applications Submitted
                                    </Tooltip>
                                  }
                                >
                                  <span
                                    class={`${data.actionBtnApplicant.theme.color} clickable`}
                                    onClick={data.actionBtnApplicant.click}
                                  >
                                    <i class="bi bi-people"></i>{' '}
                                    {data.applicationCount ?? 0}
                                  </span>
                                </OverlayTrigger>
                              </div>
                            </div>
                          </div>
                          <div class="col-lg mt-3 mt-md-0">
                            <div class="row text-center">
                              <div class="col">
                                <div class="col-auto">
                                  <span
                                    class={`${data.actionBtn.theme.color} clickable`}
                                    onClick={data.actionBtn.click}
                                  >
                                    <i
                                      class={`bi bi-send me-1 ${
                                        data.isSent == false &&
                                        tempData.selectedItem.editJobDetails
                                          ?.id !== data.id
                                          ? 'pointer'
                                          : ''
                                      }`}
                                    ></i>
                                    <small>Send</small>
                                  </span>
                                </div>
                              </div>
                              <div class="col">
                                <span
                                  class={`${data.actionBtnHistory.theme.color} clickable`}
                                  onClick={data.actionBtnHistory.click}
                                >
                                  <i class="bi bi-clock-history me-1"></i>{' '}
                                  <small>History</small>
                                </span>
                              </div>
                              <div class="col-auto">
                                <>
                                  {isPublished ? (
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip>
                                          Click to view your live post
                                        </Tooltip>
                                      }
                                    >
                                      <span
                                        class="text-danger clickable"
                                        onClick={data.viewBtn.click}
                                      >
                                        <i class="bi bi-broadcast me-1"></i>{' '}
                                        <small>Live</small>
                                      </span>
                                    </OverlayTrigger>
                                  ) : (
                                    <span class="text-muted">
                                      <i class="bi bi-exclamation-circle me-1"></i>{' '}
                                      Live
                                    </span>
                                  )}
                                </>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default JobPostTable;
