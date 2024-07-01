import { useState, useEffect, useRef } from 'react';
import SideBar from '../components/SideBar.js';
import JobPostModal from '../components/JobPostModal.js';
import PageHeader from '../components/PageHeader.js';
import {
  APPLICATION_STATUS,
  IMAGES,
  PAGES,
  SHARE_CHANNEL,
} from '../utils/constants.js';
import Breadcrumb from '../components/BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import moment from 'moment';
import ApplicationModal from '../components/ApplicationModal.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import EmptyData from '../components/EmptyData.js';
import { useTempData } from '../context/tempData.js';

const main = () => {
  const { apiData } = useApiCall();
  const { tempData, setValueTempData } = useTempData();
  const [toggleModal, setToggleModal] = useState({
    application: false,
  });

  const [selectedApplication, setSelectedApplication] = useState(null);

  const Applicant = ({ applicant, jobTitle }) => {
    return (
      <tr className="align-middle">
        <th scope="row">
          <div className="row">
            <div className="col-auto">
              <img
                className="rounded-circle border justify-content-center align-items-center avatar"
                src={IMAGES.applicant_placeholder.url}
                alt="Applicant Avatar"
              />
            </div>
            <div className="col">
              <div className="row">
                <div className="col">{applicant.fullName}</div>
              </div>
              <div className="row">
                <small>
                  <div className="col fw-light text-muted">
                    <small>
                      {applicant.createdAt}
                      <i className="bi bi-dot"></i>
                      {applicant.state}
                    </small>
                    <div className="row mt-2">
                      <div>
                        <i className="bi bi-envelope"></i> {applicant.email}
                      </div>
                      <div>
                        <i className="bi bi-telephone"></i>{' '}
                        {applicant.phoneNumber}
                      </div>
                    </div>
                  </div>
                </small>
              </div>
            </div>
          </div>
        </th>
        <td>
          <small className="fw-light">Applied for</small>
          <br />
          {jobTitle}
        </td>
        <td>
          {applicant.application_action_status == 'withdraw' ? (
            <span class="text-muted">Application Withdrawn</span>
          ) : (
            <strong
              className="text-primary fw-bold clickable"
              onClick={() => {
                setToggleModal({
                  ...toggleModal,
                  application: true,
                });
                setSelectedApplication(applicant);
              }}
            >
              {applicant.applicationStatusName}{' '}
              <i className="bi bi-pencil clickable text-primary"></i>
            </strong>
          )}
        </td>
      </tr>
    );
  };

  const createChannelButton = () => {
    return (
      <div class="col d-grid gap-2 d-md-flex justify-content-md-end">
        {/* <button class="btn btn-outline-primary btn-lg" type="button">
          <i class="bi bi-upload"></i> Bulk upload
        </button> */}
        <button
          class="btn btn-primary btn-lg"
          type="button"
          onClick={() => {
            toggleModal('editChannel');
            setValueTempData('selectedItem', {
              ...tempData.selectedItem,
              editChannel: 'create',
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
        <Breadcrumb page={PAGES.channel} />
        <PageHeader
          title={PAGES.channel.name}
          description={PAGES.channel.description}
          rightContent={createChannelButton()}
        />
        <LoadingSpinner isLoading={apiData.channel.isLoading} />
        {!apiData.channel.isLoading && apiData.channel.data.length == 0 ? (
          <EmptyData
            icon={<i class="fs-5 bi-send-exclamation"></i>}
            title="No channel yet"
            description=""
          />
        ) : (
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {apiData.channel.data?.map((item, index) => {
                let channelObject = SHARE_CHANNEL.find(
                  (channel) => channel.platform === item.platform
                );

                const data = {
                  title: item.title,
                  createdAt: item?.created_at
                    ? `${moment(item.created_at).fromNow()}`
                    : '',
                  description: item.description,
                  price: item?.price
                    ? `RM ${item?.price}/send`
                    : `RM 0.00/send`,
                  isActive: item.is_active ? 'Published' : 'Unpublish',
                };

                return (
                  <tr class="align-middle" key={index}>
                    <th scope="row">
                      <div class="row">
                        <div class="col-auto">{channelObject.icon}</div>
                        <div class="col-auto">
                          <div onClick={() => {}} class="clickable">
                            <span>{data.title} </span>
                            <small class="mx-2">
                              <i class="bi bi-pencil-square text-primary"></i>
                            </small>
                          </div>
                          <p class="card-text fw-light">
                            <small class="text-muted">
                              {channelObject.title}{' '}
                              {data.createdAt && (
                                <>
                                  <i class="bi bi-dot"></i> {data.createdAt}
                                </>
                              )}
                            </small>
                          </p>
                        </div>
                      </div>
                    </th>
                    <td>
                      <span class="text-muted">{data.price}</span>
                    </td>
                    <td>
                      <span class="text-muted">{data.isActive}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </SideBar>
  );
};

export default main;
