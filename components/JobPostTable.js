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
  }, [router.query]);

  return (
    <>
      <div>
        <LoadingSpinner isLoading={apiData.jobPost.isLoading} />
        {!apiData.jobPost.isLoading && apiData.jobPost.data.length == 0 ? (
          <div class="text-center mt-4">
            {/* <EmptyData
              icon={<i class="fs-5 bi bi-megaphone"></i>}
              title="No post yet"
              description="Create your first job post today!"
            /> */}
            <GlobalButton
              btnType="button"
              btnClass="btn btn-primary btn-lg me-2 mb-2"
              btnOnClick={() => {
                toggleModal('jobPost');
                setValueTempData('selectedItem', {
                  ...tempData.selectedItem,
                  publishModalConfigType: 'create',
                });
              }}
            >
              <i class="bi bi-plus-lg"></i> Create Post
            </GlobalButton>
          </div>
        ) : (
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
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
                  viewCount: job_post_validity?.view_count,
                  shareCount: job_post_validity?.share_count,
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
                    <th scope="row">
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
                        <span>{data.title} </span>
                        <small class="mx-2">
                          <i class="bi bi-pencil-square text-primary"></i>
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
                    </th>
                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            How many times your post has been viewed
                          </Tooltip>
                        }
                      >
                        <span class="text-muted">
                          <i class="bi bi-eye"></i> {data.viewCount ?? 0}
                        </span>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            The total number of applications received
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
                    </td>
                    <td>
                      <small class="text-muted">
                        <span class={`badge rounded-pill ${data.theme.badge}`}>
                          {data.theme.icon} {data.status}
                        </span>
                      </small>
                      <small
                        class="text-primary clickable"
                        onClick={data.actionBtnStatus.click}
                      >
                        <span>{data.actionBtnStatus.icon}</span>
                      </small>
                    </td>
                    <td>
                      <span
                        class={`${data.actionBtn.theme.color} clickable`}
                        onClick={data.actionBtn.click}
                      >
                        <i class="bi bi-send me-1"></i> Channels
                      </span>
                    </td>
                    <td>
                      <span
                        class={`${data.actionBtnHistory.theme.color} clickable`}
                        onClick={data.actionBtnHistory.click}
                      >
                        <i class="bi bi-clock-history me-1"></i> History
                      </span>
                    </td>
                    <td>
                      {isPublished ? (
                        <span
                          class="text-success clickable"
                          onClick={data.viewBtn.click}
                        >
                          <i class="bi bi-broadcast me-1"></i> Live
                        </span>
                      ) : (
                        <span class="text-muted">
                          <i class="bi bi-exclamation-circle me-1"></i> Live
                        </span>
                      )}
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
