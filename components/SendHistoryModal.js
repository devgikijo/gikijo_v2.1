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
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';

const SendHistoryModal = () => {
  const { apiData, retrySendJobPostApi } = useApiCall();

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

  // const filteredJobs = jobData?.job_post_send_que?.filter(
  //   (item) => item.payment_complete === true
  // );

  const filteredJobs = jobData?.job_post_send_que;

  const [isLoading, setIsLoading] = useState({});

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
                  icon={
                    <Image
                      src="/images/message-received.svg"
                      alt="image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: 100, height: 'auto' }}
                      class="d-inline-block align-text-top"
                    />
                  }
                  title="No History"
                  description={
                    <div class="text-center">
                      <p>Your send history will be appeared here.</p>
                    </div>
                  }
                />
              </div>
            ) : (
              <table class="table table-responsive">
                <thead>
                  <tr>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs?.map((item, index) => {
                    const data = {
                      paymentStatus: item?.payment_complete ? (
                        'Paid'
                      ) : (
                        <>
                          <i class="bi bi-clock-history me-1"></i> Pending
                          payment
                        </>
                      ),
                      createdAt: item?.created_at
                        ? `Send ${moment(item.created_at).fromNow()}`
                        : '',
                      expiredAt: item?.expired_at ? (
                        moment(item.expired_at).isBefore(moment()) ? (
                          <>
                            <i class="bi bi-hourglass-bottom me-1"></i>Expired{' '}
                            {moment(item.expired_at).fromNow()}
                          </>
                        ) : (
                          <>
                            <i class="bi bi-hourglass-split me-1"></i>Expires{' '}
                            {moment(item.expired_at).fromNow()}
                          </>
                        )
                      ) : (
                        ''
                      ),
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
                        <td>
                          <div class="row">
                            <div class="d-flex col-auto align-items-center">
                              {channelInfo.icon}
                            </div>
                            <div class="col">
                              <h6
                                class="mb-0 clickable"
                                onClick={() => {
                                  if (data.channel?.url) {
                                    window.open(data.channel.url, '_blank');
                                  }
                                }}
                              >
                                {data?.channel.title}
                              </h6>
                              <small class="text-muted">
                                <i class="bi bi-send"></i> {data.createdAt}
                              </small>
                              <br />
                              {data.message_url[channelInfo.platform]
                                .is_result_exist ? (
                                <>
                                  {data.expiredAt ? (
                                    <small class="text-muted me-1">
                                      {data.expiredAt},
                                    </small>
                                  ) : (
                                    ''
                                  )}
                                  <small
                                    class="text-primary clickable"
                                    onClick={() => {
                                      window.open(
                                        data.message_url[channelInfo.platform]
                                          .url,
                                        '_blank'
                                      );
                                    }}
                                  >
                                    View in Channel{' '}
                                    <i class="bi bi-arrow-up-right-circle"></i>
                                  </small>
                                </>
                              ) : (
                                <>
                                  <small class="text-muted">
                                    {data.paymentStatus}
                                  </small>
                                  <br />
                                  {/* <small class="text-muted">
                                    <i class="bi bi-clock-history me-1"></i>{' '}
                                    Awaiting admin approval
                                  </small>
                                  <br /> */}
                                  {isLoading[item.id] ? (
                                    <LoadingSpinner
                                      isLoading={true}
                                      isSmall={true}
                                    />
                                  ) : (
                                    <small>
                                      <small class="text-danger">
                                        <i class="bi bi-exclamation-circle"></i>{' '}
                                        Link doest not exist,
                                      </small>{' '}
                                      <small
                                        class="text-primary clickable"
                                        onClick={async () => {
                                          setIsLoading({ [item.id]: true });
                                          const result =
                                            await retrySendJobPostApi({
                                              postData: {
                                                job_post_send_que_id: item.id,
                                              },
                                            });

                                          if (result) {
                                            setValueTempData('selectedItem', {
                                              ...tempData.selectedItem,
                                              editJobDetails: result,
                                            });
                                          }

                                          setIsLoading({ [item.id]: false });
                                        }}
                                      >
                                        Click to Resend
                                      </small>
                                    </small>
                                  )}
                                </>
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
