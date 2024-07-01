import Modal from 'react-bootstrap/Modal';
import GlobalButton from './GlobalButton';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import {
  findInArray,
  formatDisplayNumber,
  generateUniqueID,
  getDisplayValue,
  getStripe,
  jobCardContent,
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
import { motion } from 'framer-motion';
import { useApiCall } from '../context/apiCall';
import { useTempData } from '../context/tempData';
import { useModal } from '../context/modal';
import { useRouter } from 'next/router';
import JobCard from './JobCard';
import Link from 'next/link';
import Image from 'next/image';

const JobPostModal = () => {
  const {
    apiData,
    getJobPostApi,
    addJobPostApi,
    editJobPostApi,
    deleteJobPostApi,
    addNotificationApi,
    publishJobPostApi,
    createStripeCustomerApi,
    createStripeCheckoutSessionApi,
  } = useApiCall();

  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const jobData = tempData.selectedItem.editJobDetails;
  const companyData = apiData.companyProfile.data;
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);
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

  const [arrayElements, setArrayElements] = useState({
    requirements: [''],
    benefits: [''],
  });

  const currentSection = tempData.selectedItem?.publishModalConfigType;

  const handleClose = () => {
    toggleModal('jobPost');
    setToggleAnimation(false);
    setValueTempData('selectedItem', {
      ...tempData.selectedItem,
      editJobDetails: null,
    });
    setSelectedItems([]);
    setSelectedTokens([]);
    setArrayElements({
      requirements: [''],
      benefits: [''],
    });
  };

  const formConfig = () => {
    const forms = {
      job_post: {
        title: document.getElementById('input-job-title'),
        employment_type: document.getElementById('select-job-type'),
        min_salary: document.getElementById('input-min-salary'),
        max_salary: document.getElementById('input-max-salary'),
        salary_type: document.getElementById('select-salary-type'),
        // requirements
        // benefits
        additional_info: document.getElementById('input-additional-info'),
        agree_to_term: document.getElementById('input-agree-to-term'),
      },
    };

    return forms;
  };

  useEffect(() => {
    if (jobData && isModalOpen.jobPost && currentSection == 'create') {
      for (const key in jobData) {
        if (formConfig().job_post.hasOwnProperty(key)) {
          const element = formConfig().job_post[key];
          if (element?.type === 'checkbox') {
            if (jobData[key]) {
              element.checked = true;
            } else {
              element.checked = false;
            }
          } else {
            element.value = jobData[key];
          }
        }
      }
      setArrayElements((prevState) => ({
        ...prevState,
        requirements: jobData?.requirements || [],
        benefits: jobData?.benefits || [],
      }));
    }
  }, [jobData, isModalOpen.jobPost]);

  const getKeyValue = () => {
    const keyValue = {};
    for (const key in formConfig().job_post) {
      const element = formConfig().job_post[key];
      if (element?.type === 'checkbox') {
        keyValue[key] = element.checked;
      } else {
        keyValue[key] = element.value;
      }
    }

    return keyValue;
  };

  const onDeleteJobPost = async (event) => {
    event.preventDefault();

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this record?'
    );

    if (confirmDelete) {
      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: true,
        },
      });

      const result = await deleteJobPostApi({
        id: jobData.id,
      });

      if (result) {
        handleClose();
      }

      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: false,
        },
      });
    }
  };

  const getJobSummary = (item) => {
    const jobData = {
      jobTitle: item?.title,
      employmentType: EMPLOYMENT_TYPES.find(
        (type) => type.value === item?.employment_type
      )?.name,
      salary: `RM ${item?.min_salary} - ${item?.max_salary} ${
        SALARY_TYPES.find((type) => type.value === item?.salary_type)?.name
      }`,
      requirements: item?.requirements ? item.requirements : [],
      benefits: item?.benefits ? item.benefits : [],
      additionalInfo: item?.additional_info ? item.additional_info : '',
      location: `${getDisplayValue(companyData, 'address_1')}${
        getDisplayValue(companyData, 'address_2')
          ? `, ${getDisplayValue(companyData, 'address_2')}`
          : ''
      }${
        getDisplayValue(companyData, 'city')
          ? `, ${getDisplayValue(companyData, 'city')}`
          : ''
      }${
        getDisplayValue(companyData, 'state')
          ? `, ${getDisplayValue(companyData, 'state')}`
          : ''
      }, ${getDisplayValue(
        findInArray(COUNTRIES, 'value', companyData?.country),
        'name',
        ''
      )}`,
      company: companyData?.company_name || '-',
      size: getDisplayValue(
        findInArray(COMPANY_SIZES, 'value', companyData?.size),
        'name',
        '-'
      ),
      registration_number: companyData?.registration_number || '-',
      industries:
        Array.isArray(getDisplayValue(companyData, 'industries')) &&
        getDisplayValue(companyData, 'industries').map(
          (industry, index) =>
            INDUSTRIES.find((level) => level.value === industry)?.name ?? '-'
        ),
    };

    const summary = `
    Job Title: ${jobData.jobTitle},
    Employment Type: ${jobData.employmentType},
    Requirements: ${jobData.requirements.join(', ') || 'None specified'},
    Benefits: ${jobData.benefits.join(', ') || 'None specified'},
    Additional Info: ${jobData.additionalInfo},   
    Location: ${jobData.location},
    Salary: ${jobData.salary},
    Company: ${jobData.company},
    Size: ${jobData.size},
    Industries: ${jobData.industries.join(', ')},
    Registration Number: ${jobData.registration_number}
    `;

    return summary;
  };

  const onSubmitJobPost = async (event) => {
    event.preventDefault();

    if (!companyData.id) {
      toast.error('Company not found!');
      return;
    }

    setButtonConfig((prevConfig) => ({
      ...prevConfig,
      submit: {
        ...prevConfig.submit,
        isLoading: true,
      },
    }));

    const addData = {
      ...getKeyValue(),
      requirements: arrayElements.requirements,
      benefits: arrayElements.benefits,
      company_profile_id: companyData.id,
    };

    addData.summary = getJobSummary(addData);

    if (addData.min_salary == '') {
      addData.min_salary = null;
    }

    if (addData.max_salary == '') {
      addData.max_salary = null;
    }

    try {
      if (jobData?.id) {
        const resultEdit = await editJobPostApi({
          postData: addData,
          id: jobData.id,
        });

        if (resultEdit) {
          handleClose();
          toast.success('Save!');
        }
      } else {
        const resultAdd = await addJobPostApi({
          uid: generateUniqueID(),
          ...addData,
        });

        if (resultAdd) {
          const resultPublish = await publishJobPostApi({
            job_post_id: resultAdd.id,
            is_published: true,
          });

          if (resultPublish?.data?.is_published == true) {
            toast.success('Your job post is Live on Gikijo!', {
              duration: 5000,
            });

            await addNotificationApi({
              message: 'Your job post is Live!',
              message_detail:
                'Your job post is now live and visible to potential candidates. Good luck with your recruitment process!',
              action_url: `${PAGES.viewJob.directory}?jobId=${resultAdd.uid}`,
              action_title: 'View Live',
            });

            setToggleAnimation(true);
            setValueTempData('selectedItem', {
              ...tempData.selectedItem,
              editJobDetails: resultAdd,
              publishModalConfigType: 'share',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error submitting job post:', error);
    } finally {
      setButtonConfig((prevConfig) => ({
        ...prevConfig,
        submit: {
          ...prevConfig.submit,
          isLoading: false,
        },
      }));
    }
  };

  const onSubmitShare = async (event) => {
    event.preventDefault();

    if (!jobData?.job_post_validity?.is_published) {
      toast.error('Please publish your job post and try again.');
      return;
    }

    setButtonConfig((prevConfig) => ({
      ...prevConfig,
      share: {
        ...prevConfig.share,
        isLoading: true,
      },
    }));

    if (selectedItems.length == 0) {
      toast.error('Please choose a channel to continue.');
    }

    if (selectedItems.length > 0) {
      const stripeCustomer = await createStripeCustomerApi();

      if (stripeCustomer?.stripe_customer_id) {
        const stripeHelper = await getStripe();

        const stripeCheckoutSession = await createStripeCheckoutSessionApi({
          customerId: stripeCustomer.stripe_customer_id,
          totalPrice: checkTotalPrice(),
          bulkSendQue: selectedItems,
          bulkToken: selectedTokens,
        });

        if (stripeCheckoutSession?.session_id) {
          try {
            await stripeHelper.redirectToCheckout({
              sessionId: stripeCheckoutSession.session_id,
            });
          } catch (error) {
            toast.error(error);
          }
        }
      }
    }

    setButtonConfig((prevConfig) => ({
      ...prevConfig,
      share: {
        ...prevConfig.share,
        isLoading: false,
      },
    }));
  };

  const addElement = (type) => {
    setArrayElements((prevState) => ({
      ...prevState,
      [type]: [...prevState[type], ''],
    }));
  };

  const removeElement = (type, index) => {
    setArrayElements((prevState) => ({
      ...prevState,
      [type]: prevState[type].filter((_, i) => i !== index),
    }));
  };

  const handleChange = (type, index, value) => {
    const updatedElements = [...arrayElements[type]];
    updatedElements[index] = value;
    setArrayElements((prevState) => ({
      ...prevState,
      [type]: updatedElements,
    }));
  };

  const checkTotalPrice = () => {
    const totalAmount = apiData.allChannel.data?.reduce(
      (sum, { id, price }) => {
        if (selectedItems.some((item) => item.channel_id === id)) {
          return sum + price;
        }
        return sum;
      },
      0
    );

    let totalTokenPrice = 0;
    if (selectedTokens.length > 0) {
      totalTokenPrice = selectedTokens.reduce((sum, { price }) => {
        return sum + price;
      }, 0);
    }

    return totalAmount - totalTokenPrice;
  };

  const animatedSwipe = ({ view, key, showAnimation = true }) => {
    return (
      <>
        {showAnimation ? (
          <motion.div
            className="z-10"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring' }}
            key={key}
          >
            <motion.div
              variants={{
                hidden: {
                  x: '20%', // start off-screen to the right
                  opacity: 0,
                },
                show: {
                  x: '0%', // final position on screen
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {view}
            </motion.div>
          </motion.div>
        ) : (
          view
        )}
      </>
    );
  };

  const getMessageContent = (item) => {
    const jobItem = jobCardContent(item);

    var benefitsList = '';
    if (jobItem.benefits.length > 0) {
      benefitsList = jobItem.benefits
        .map((benefit) => `• ${benefit}`)
        .join('\n');
      benefitsList = `\n${benefitsList}\n`;
    }

    const applyLink = `${process.env.NEXT_PUBLIC_DOMAIN_URL}${PAGES.viewJob.directory}?jobId=${jobItem.uid}`;
    const socialContent = `🟢 ${jobItem.title} 🟢\n\n 🏢 ${jobItem.companyName}\n 🏷️ ${jobItem.employmentType}\n 💵 ${jobItem.salary}\n 📍 ${jobItem.location}\n${benefitsList}\nApply here 👉 ${applyLink}`;

    return socialContent;
  };

  const checkIfTokenExist = () => {
    if (apiData.profile.data?.token?.length > 0) {
      const myToken = apiData.profile.data.token.filter((item) => !item.used);
      return myToken;
    } else {
      return [];
    }
  };
  const viewConfig = {
    create: {
      title: jobData ? 'Edit Post' : 'New Post',
      body: (
        <div>
          <div class="mb-3">
            <div>
              <ul class="list-unstyled bg-light rounded-2 p-2 mt-2">
                <li>
                  <label class="small text-muted">Company</label>
                  <div class="mb-0 text-truncate">
                    {companyData ? (
                      companyData.company_name
                    ) : (
                      <h6
                        class="text-primary clickable mb-0 mt-1"
                        onClick={() => {
                          router.push(PAGES.company_profile.directory);
                        }}
                      >
                        <i class="bi bi-plus-square-dotted ms-1"></i> Add
                        Company
                      </h6>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-3">
            <label htmlFor="input-job-title" class="form-label">
              Job Title
            </label>
            <input
              type="text"
              class="form-control"
              id="input-job-title"
              required
              maxLength={100}
            />
          </div>
          <div class="mb-3">
            <label htmlFor="select-job-type" class="form-label">
              Type
            </label>
            <select class="form-select" id="select-job-type" required>
              <option value="" disabled>
                Please select
              </option>
              {EMPLOYMENT_TYPES.map((item, index) => {
                return (
                  <option value={item.value} key={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div class="mb-3">
            <label htmlFor="input-min-salary" class="form-label">
              Salary
            </label>
            <div class="row g-2">
              <div class="col-md">
                <div class="input-group">
                  <span class="input-group-text">RM</span>
                  <input
                    type="number"
                    class="form-control"
                    id="input-min-salary"
                    placeholder="min"
                  />
                </div>
              </div>
              <div class="col-md">
                <div class="input-group">
                  <span class="input-group-text">RM</span>
                  <input
                    type="number"
                    class="form-control"
                    id="input-max-salary"
                    placeholder="max"
                  />
                </div>
              </div>
              <div class="col-md">
                <select class="form-select" id="select-salary-type">
                  {SALARY_TYPES.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <DynamicSingleForm
            elements={arrayElements.requirements}
            setElements={(elements) =>
              setArrayElements({ ...arrayElements, requirements: elements })
            }
            addElement={() => addElement('requirements')}
            removeElement={(index) => removeElement('requirements', index)}
            handleChange={(index, value) =>
              handleChange('requirements', index, value)
            }
            label="Requirements"
          />
          <DynamicSingleForm
            elements={arrayElements.benefits}
            setElements={(elements) =>
              setArrayElements({ ...arrayElements, benefits: elements })
            }
            addElement={() => addElement('benefits')}
            removeElement={(index) => removeElement('benefits', index)}
            handleChange={(index, value) =>
              handleChange('benefits', index, value)
            }
            label="Benefits"
          />
          <div class="mb-3">
            <label htmlFor="input-additional-info" class="form-label">
              Additional Info
            </label>
            <textarea
              type="text"
              class="form-control"
              id="input-additional-info"
              rows="3"
              maxLength={300}
            />
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="input-agree-to-term"
              required
            />
            <label
              class="form-check-label text-muted"
              htmlFor="input-agree-to-term"
            >
              <small>
                I confirm that I have read and agreed to the{' '}
                <Link
                  href={PAGES.terms_conditions.directory}
                  class="clickable"
                  target="_blank"
                >
                  terms and conditions.
                </Link>
              </small>
            </label>
          </div>
        </div>
      ),
      onSubmitFunction: onSubmitJobPost,
      footer: (
        <>
          {jobData ? (
            <>
              <GlobalButton
                btnType="button"
                btnClass="btn btn-danger btn-lg"
                btnTitle="Delete"
                btnLoading={buttonConfig.delete.isLoading}
                btnOnClick={onDeleteJobPost}
              />
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Save"
                btnLoading={buttonConfig.submit.isLoading}
              />
            </>
          ) : (
            <GlobalButton
              btnType="submit"
              btnClass="btn btn-primary btn-lg"
              btnTitle="Save & Publish"
              btnLoading={buttonConfig.submit.isLoading}
            />
          )}
        </>
      ),
    },
    share: {
      title: 'Channels',
      body: (
        <>
          {animatedSwipe({
            view: (
              <div>
                {jobData ? (
                  <div
                    class="mb-3"
                    onClick={() => {
                      // window.open(
                      //   `${PAGES.viewJob.directory}?jobId=${jobData.uid}`,
                      //   '_blank'
                      // );
                    }}
                  >
                    <JobCard
                      item={jobData}
                      displayOnly={true}
                      showSettingsInfo={true}
                    />
                  </div>
                ) : (
                  ''
                )}
                <h5 class="mt-3">Send to</h5>
                <ul class="list-group list-group-flush mt-3">
                  {apiData.allChannel.data?.map((item, index) => {
                    let channelIcon = SHARE_CHANNEL.find(
                      (channel) => channel.platform === item?.platform
                    );

                    let channelEmploymentType = EMPLOYMENT_TYPES.find(
                      (type) => type.value === item?.employment_type
                    )?.name;

                    return (
                      <li key={index} class="list-group-item">
                        <div class="row">
                          <div class="d-flex col-auto align-items-center">
                            {channelIcon.icon}
                          </div>
                          <div class="col">
                            <h6 class="card-title">
                              <span
                                class="clickable"
                                onClick={() => {
                                  if (item?.url) {
                                    window.open(item.url, '_blank');
                                  }
                                }}
                              >
                                {item.title}
                              </span>
                            </h6>
                            <div>
                              <small class="text-muted">
                                {channelEmploymentType}
                              </small>
                              <i class="bi bi-dot"></i>
                              <small class="text-muted">
                                {formatDisplayNumber(item.total_subscribers)}{' '}
                                subscribers
                              </small>
                            </div>
                            <p
                              class="card-text text-truncate text-muted"
                              style={{ maxWidth: '250px' }}
                            >
                              {item?.price
                                ? `RM ${item?.price}/send`
                                : `RM 0.00/send`}
                            </p>
                          </div>
                          <div class="col-auto">
                            <div class="form-check form-switch form-switch-md">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id={`input-switch-${item.id}`}
                                checked={selectedItems.some(
                                  (selected) => selected.channel_id === item.id
                                )}
                                onChange={() => {
                                  const isSelected = selectedItems.some(
                                    (selected) =>
                                      selected.channel_id === item.id
                                  );

                                  setSelectedItems((prevSelected) => {
                                    if (isSelected) {
                                      return prevSelected.filter(
                                        (selected) =>
                                          selected.channel_id !== item.id
                                      );
                                    } else {
                                      return [
                                        ...prevSelected,
                                        {
                                          channel_id: item.id,
                                          job_post_id: jobData.id,
                                          user_uuid: apiData.user.data?.id,
                                          message_content: `${
                                            item?.prefix_content
                                              ? item.prefix_content
                                              : ''
                                          }\n${getMessageContent(jobData)}\n${
                                            item?.suffix_content
                                              ? item.suffix_content
                                              : ''
                                          }`,
                                        },
                                      ];
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {checkIfTokenExist().length > 0 ? (
                  <>
                    <h5 class="mt-3">Apply Discounts</h5>
                    <ul class="list-group list-group-flush mt-3">
                      {checkIfTokenExist().map((item, index) => {
                        return (
                          <li key={index} class="list-group-item">
                            <div class="row">
                              <div class="d-flex col-auto align-items-center">
                                <Image
                                  src="/images/coin-group-12.svg"
                                  alt="image"
                                  width={0}
                                  height={0}
                                  sizes="100vw"
                                  style={{ width: 50, height: 50 }}
                                  class="d-inline-block align-text-top"
                                />
                              </div>
                              <div class="col">
                                <h6 class="card-title">
                                  <span>Token Balance</span>
                                </h6>
                                <p
                                  class="card-text text-truncate text-muted"
                                  style={{ maxWidth: '250px' }}
                                >
                                  {item?.token_amount ? item.token_amount : 0}{' '}
                                  tokens
                                </p>
                              </div>
                              <div class="col-auto">
                                <div class="form-check form-switch form-switch-md">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id={`input-switch-${item.id}`}
                                    checked={selectedTokens.some(
                                      (selected) => selected.id === item.id
                                    )}
                                    onChange={() => {
                                      const isSelected = selectedTokens.some(
                                        (selected) => selected.id === item.id
                                      );

                                      setSelectedTokens((prevSelected) => {
                                        if (isSelected) {
                                          return prevSelected.filter(
                                            (selected) =>
                                              selected.id !== item.id
                                          );
                                        } else {
                                          return [
                                            ...prevSelected,
                                            {
                                              ...item,
                                            },
                                          ];
                                        }
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  ''
                )}
              </div>
            ),
            key: currentSection,
            showAnimation: toggleAnimation,
          })}
        </>
      ),
      onSubmitFunction: onSubmitShare,
      footer: (
        <div class="row w-100 m-0">
          <div class="col">
            <small class="text-muted">Total</small>
            {animatedSwipe({
              view: <h4 class="mb-0">{`RM ${checkTotalPrice()}`}</h4>,
              key: checkTotalPrice(),
              showAnimation: true,
            })}
          </div>
          <div class="col d-flex justify-content-end align-items-center">
            <GlobalButton
              btnType="submit"
              btnClass={`btn ${
                jobData?.job_post_validity?.is_published
                  ? 'btn-primary'
                  : 'btn-secondary'
              } btn-lg`}
              btnTitle="Pay & Send"
              btnLoading={buttonConfig.share.isLoading}
            />
          </div>
        </div>
      ),
    },
  };

  return (
    <>
      <Modal show={isModalOpen.jobPost} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{viewConfig[currentSection]?.title}</Modal.Title>
        </Modal.Header>
        <form onSubmit={viewConfig[currentSection]?.onSubmitFunction}>
          <Modal.Body>{viewConfig[currentSection]?.body}</Modal.Body>
          <Modal.Footer>{viewConfig[currentSection]?.footer}</Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default JobPostModal;
