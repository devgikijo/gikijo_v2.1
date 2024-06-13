import Modal from 'react-bootstrap/Modal';
import GlobalButton from './GlobalButton';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import {
  findInArray,
  generateUniqueID,
  getDisplayValue,
  getStripe,
} from '../utils/helper';
import DynamicSingleForm from './DynamicSingleForm';
import {
  COMPANY_SIZES,
  COUNTRIES,
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  PAGES,
  SALARY_TYPES,
  SHARE_CHANNEL,
  STAGGER_CHILD_VARIANTS,
} from '../utils/constants';
import moment from 'moment';
import { motion } from 'framer-motion';
import { useApiCall } from '../context/apiCall';
import { useTempData } from '../context/tempData';
import { useModal } from '../context/modal';
import { useRouter } from 'next/router';
import JobCard from './JobCard';
import EmptyData from './EmptyData';

const SendHistoryModal = () => {
  const { apiData } = useApiCall();

  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const jobData = tempData.selectedItem.editJobDetails;
  const companyData = apiData.companyProfile.data;
  const [selectedItems, setSelectedItems] = useState([]);
  const [toggleAnimation, setToggleAnimation] = useState(false);
  const [buttonConfig, setButtonConfig] = useState({
    submit: {
      isLoading: false,
    },
    share: {
      isLoading: false,
    },
    delete: {
      isLoading: false,
    },
  });

  const handleClose = () => {
    toggleModal('sendHistory');
    setValueTempData('selectedItem', {
      ...tempData.selectedItem,
      editJobDetails: null,
    });
  };

  const filteredJobs = jobData?.job_post_send_que?.filter(
    (item) => item.payment_complete === true
  );

  return (
    <>
      <Modal show={isModalOpen.sendHistory} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Send History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {filteredJobs?.length == 0 ? (
              <div class="text-center my-4">
                <EmptyData
                  icon={<i class="fs-5 bi bi-clock-history"></i>}
                  title="No History"
                  description="Your send history will be appeared here."
                />
              </div>
            ) : (
              <table class="table table-responsive table-hover">
                <thead>
                  <tr>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs?.map((item, index) => {
                    const data = {
                      createdAt: item?.created_at
                        ? `${moment(item.created_at).fromNow()}`
                        : '',
                      channel: item?.channel,
                      message_url: {
                        telegram: {
                          is_result_exist: item?.send_result?.ok ? true : false,
                          url: `https://t.me/${item?.send_result?.result?.chat?.username}/${item?.send_result?.result?.message_id}`,
                        },
                      },
                    };

                    let channelInfo = SHARE_CHANNEL.find(
                      (channel) => channel.platform === data?.channel?.platform
                    );

                    return (
                      <tr class="align-middle" key={index}>
                        <td
                          class="pointer-hover"
                          onClick={() => {
                            if (
                              data.message_url[channelInfo.platform]
                                .is_result_exist
                            ) {
                              window.open(
                                data.message_url[channelInfo.platform].url,
                                '_blank'
                              );
                            } else {
                              if (data.channel?.url) {
                                window.open(data.channel.url, '_blank');
                              }
                            }
                          }}
                        >
                          <div class="row">
                            <div class="d-flex col-auto align-items-center">
                              {channelInfo.icon}
                            </div>
                            <div class="col">
                              <h6 class="mb-0">{data?.channel.title}</h6>
                              <small class="text-muted">{data.createdAt}</small>
                            </div>
                            <div class="col text-end">
                              {data.message_url[channelInfo.platform]
                                .is_result_exist ? (
                                <small class="text-primary">
                                  View in Channel{' '}
                                  <i class="bi bi-arrow-up-right-circle"></i>
                                </small>
                              ) : (
                                <small class="text-muted">
                                  <i class="bi bi-clock-history me-1"></i>{' '}
                                  Awaiting admin approval
                                </small>
                              )}
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SendHistoryModal;
