import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { PAGES } from '../utils/constants';
import { generateUniqueID } from '../utils/helper';
import { usePathname } from 'next/navigation';

const ApiCallContext = createContext();

export const useApiCall = () => useContext(ApiCallContext);

export const ApiCallProvider = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mainData, setMainData] = useState({
    topCompanyProfile: {
      data: [],
      isLoading: true,
    },
    allCompanyProfile: {
      data: [],
      isLoading: true,
    },
    topJobPost: {
      data: [],
      isLoading: true,
    },
    allJobPost: {
      data: [],
      isLoading: true,
    },
    allChannel: {
      data: [],
      isLoading: true,
    },
    user: {
      data: null,
      isLoading: true,
    },
    profile: {
      data: null,
      isLoading: true,
    },
    notification: {
      data: [],
      isLoading: true,
    },
    jobPost: {
      data: [],
      isLoading: true,
    },
    companyProfile: {
      data: [],
      isLoading: true,
    },
    resume: {
      data: [],
      isLoading: true,
    },
    application: {
      data: [],
      isLoading: true,
    },
    channel: {
      data: [],
      isLoading: true,
    },
  });

  const resetData = () => {
    setMainData({
      ...mainData,
      user: {
        data: null,
        isLoading: true,
      },
      profile: {
        data: null,
        isLoading: true,
      },
      notification: {
        data: [],
        isLoading: true,
      },
      jobPost: {
        data: [],
        isLoading: true,
      },
      companyProfile: {
        data: [],
        isLoading: true,
      },
      resume: {
        data: [],
        isLoading: true,
      },
      application: {
        data: [],
        isLoading: true,
      },
    });
  };

  const getUserApi = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }

      if (data?.user) {
        setMainData((prevData) => ({
          ...prevData,
          user: {
            data: data?.user,
            isLoading: false,
          },
        }));
      }

      return data?.user ?? null;
    } catch (error) {
      console.error(error);
    }
  };

  const getProfileApi = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*, role (role_type)')
        .single()
        .eq('user_uuid', mainData.user.data?.id);

      setMainData((prevData) => ({
        ...prevData,
        profile: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const updateProfileApi = async ({ postData }) => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .update({
          username: postData.username,
          full_name: postData.full_name,
        })
        .eq('user_uuid', mainData.user.data?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        profile: {
          data: data,
          isLoading: false,
        },
      }));

      toast.success('Updated!');
      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateOnboardingApi = async ({ postData }) => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .update({
          onboarding: postData.onboarding,
        })
        .eq('user_uuid', mainData.user.data?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        profile: {
          data: data,
          isLoading: false,
        },
      }));

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateAccountTypeApi = async ({ postData }) => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .update({
          account_type: postData.accountType,
        })
        .eq('user_uuid', mainData.user.data?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        profile: {
          data: data,
          isLoading: false,
        },
      }));

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateProductTourApi = async ({ postData }) => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .update({
          product_tour: postData.productTour,
        })
        .eq('user_uuid', mainData.user.data?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        profile: {
          data: data,
          isLoading: false,
        },
      }));

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getNotificationApi = async () => {
    try {
      const { data, error } = await supabase
        .from('notification')
        .select('*')
        .eq('user_uuid', mainData.user.data?.id)
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        notification: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addNotificationApi = async (postData) => {
    try {
      const response = await fetch('/api/notification/add-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postData: { ...postData },
          user_uuid: postData?.user_uuid
            ? postData.user_uuid
            : mainData.user.data?.id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          const data = responseData.data;
          if (data && data.user_uuid == mainData.user.data?.id) {
            mainData.notification.data.unshift(data);
          }
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const updateNotificationApi = async (postData) => {
    try {
      const { data, error } = await supabase
        .from('notification')
        .update({
          is_read: true,
        })
        .eq('id', postData?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const currentNotifications = mainData.notification.data;
      if (currentNotifications.length !== 0) {
        const indexToReplace = currentNotifications.findIndex(
          (obj) => obj.id === data.id
        );
        const newNotifications = [
          ...currentNotifications.slice(0, indexToReplace),
          data,
          ...currentNotifications.slice(indexToReplace + 1),
        ];

        setMainData((prevData) => ({
          ...prevData,
          notification: {
            data: newNotifications,
            isLoading: false,
          },
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getJobPostApi = async () => {
    try {
      const response = await fetch('/api/job-post/get-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_uuid: mainData.user.data?.id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          const data = responseData.data;
          setMainData((prevData) => ({
            ...prevData,
            jobPost: {
              data: data,
              isLoading: false,
            },
          }));
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const addJobPostApi = async (postData) => {
    try {
      const response = await fetch('/api/job-post/add-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postData: { ...postData },
          user_uuid: mainData.user.data?.id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          const data = responseData.data;
          mainData.jobPost.data.unshift(data);
          return data;
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const editJobPostApi = async ({ postData, id }) => {
    try {
      const response = await fetch('/api/job-post/edit-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postData: { ...postData },
          postId: id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          const data = responseData.data;
          const currentData = mainData.jobPost.data;
          const indexToReplace = currentData.findIndex(
            (obj) => obj.id === data.id
          );
          const newData = [
            ...currentData.slice(0, indexToReplace),
            data,
            ...currentData.slice(indexToReplace + 1),
          ];

          setMainData((prevData) => ({
            ...prevData,
            jobPost: {
              data: newData,
              isLoading: false,
            },
          }));

          return data;
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const deleteJobPostApi = async (postData) => {
    try {
      const { data, error } = await supabase
        .from('job_post')
        .delete()
        .eq('id', postData.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const currentJobs = mainData.jobPost.data;
        const newJobs = currentJobs.filter((job) => job.id !== data.id);

        setMainData((prevData) => ({
          ...prevData,
          jobPost: {
            data: newJobs,
            isLoading: false,
          },
        }));

        toast.success('Deleted!');
        return data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const publishJobPostApi = async (postData) => {
    try {
      const response = await fetch('/api/job-post/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          const currentData = mainData.jobPost.data;
          const returnData = responseData.data;

          function findAndReplace(data, returnData) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].id == returnData.job_post_id) {
                data[i].job_post_validity = returnData;
                break;
              }
            }
            return data;
          }

          const newData = findAndReplace(currentData, returnData);

          setMainData((prevData) => ({
            ...prevData,
            jobPost: {
              data: newData,
              isLoading: false,
            },
          }));

          return responseData;
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  // const deleteChannelPostApi = async (postData) => {
  //   try {
  //     const idsToDelete = postData.channel_post.map((item) => item.id);
  //     const { data, error } = await supabase
  //       .from('job_post_send_que')
  //       .delete()
  //       .in('id', idsToDelete) // bulk delete (array)
  //       .select();

  //     if (error) {
  //       throw error;
  //     }

  //     return data;
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const getResumeApi = async () => {
    try {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .eq('user_uuid', mainData.user.data?.id);

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        resume: {
          data: data.length > 0 ? data[0] : [],
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const addResumeApi = async ({ postData }) => {
    try {
      let dataToUpdate = { ...postData, user_uuid: mainData.user.data?.id };

      if (!postData.uid) {
        dataToUpdate.uid = generateUniqueID();
      }

      const { data, error } = await supabase
        .from('resume')
        .upsert(dataToUpdate, { onConflict: 'user_uuid' })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        resume: {
          data: data,
          isLoading: false,
        },
      }));

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCompanyProfileApi = async () => {
    try {
      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .eq('user_uuid', mainData.user.data?.id);

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        companyProfile: {
          data: data.length > 0 ? data[0] : [],
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addCompanyProfileApi = async ({ postData }) => {
    try {
      let dataToUpdate = { ...postData, user_uuid: mainData.user.data?.id };

      if (!postData.uid) {
        dataToUpdate.uid = generateUniqueID();
      }

      const { data, error } = await supabase
        .from('company_profile')
        .upsert(dataToUpdate, { onConflict: 'user_uuid' })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setMainData((prevData) => ({
          ...prevData,
          companyProfile: {
            data: data,
            isLoading: false,
          },
        }));
      }

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getApplicationApi = async () => {
    try {
      const { data, error } = await supabase
        .from('application')
        .select('*, job_post (*, company_profile (*))')
        .eq('user_uuid', mainData.user.data?.id)
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        application: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getChannelApi = async () => {
    try {
      const { data, error } = await supabase
        .from('channel')
        .select('*')
        .eq('user_uuid', mainData.user.data?.id)
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        channel: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const applyJobPostApi = async ({ postData }) => {
    try {
      const { data, error } = await supabase
        .from('application')
        .select('*, job_post (*, company_profile (*))')
        .eq('job_post_id', postData.job_post_id)
        .eq('user_uuid', mainData.user.data?.id);

      if (error) {
        throw error;
      }

      if (data.length == 0) {
        const { data, error } = await supabase
          .from('application')
          .insert({ ...postData, user_uuid: mainData.user.data?.id })
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          mainData.application.data.unshift(data);
        }

        return data;
      }

      if (data.length > 0) {
        toast.error('Application already submitted!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editApplicationApi = async ({ postData, id }) => {
    try {
      const response = await fetch('/api/application/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postData: { ...postData },
          postId: id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          const data = responseData.data;
          return data.length > 0 ? data[0] : [];
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const getTopJobPostApi = async ({ limit: limit }) => {
    setMainData((prevData) => ({
      ...prevData,
      topJobPost: {
        ...prevData.topJobPost,
        isLoading: true,
      },
    }));

    try {
      let query = supabase
        .from('job_post')
        .select('*, job_post_validity!inner(*), company_profile (*)')
        .eq('job_post_validity.is_published', true)
        .order('id', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        topJobPost: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
      setMainData((prevData) => ({
        ...prevData,
        topJobPost: {
          ...prevData.topJobPost,
          isLoading: false,
        },
      }));
    }
  };

  const getAllJobPostApi = async ({
    jobFilter: jobFilter,
    from: from,
    to: to,
  }) => {
    setMainData((prevData) => ({
      ...prevData,
      allJobPost: {
        ...prevData.allJobPost,
        isLoading: true,
      },
    }));

    try {
      let query = supabase
        .from('job_post')
        .select('*, job_post_validity!inner(*), company_profile (*)')
        .eq('job_post_validity.is_published', true)
        .range(from, to)
        .order('id', { ascending: false });

      if (jobFilter?.keyword) {
        query = query.textSearch('summary', jobFilter.keyword, {
          type: 'websearch',
          config: 'english',
        });
      }

      if (jobFilter?.type) {
        query = query.eq('employment_type', jobFilter.type);
      }

      if (jobFilter?.minSalary) {
        query = query.gte('min_salary', jobFilter.minSalary);
      }

      if (jobFilter?.maxSalary) {
        query = query.lte('max_salary', jobFilter.maxSalary);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        allJobPost: {
          data: data,
          isLoading: false,
        },
      }));

      return data;
    } catch (error) {
      toast.error(error.message);
      setMainData((prevData) => ({
        ...prevData,
        allJobPost: {
          ...prevData.allJobPost,
          isLoading: false,
        },
      }));
    }
  };

  const getJobDetailsApi = async (postData) => {
    try {
      const { data, error } = await supabase
        .from('job_post')
        .select('*, job_post_validity!inner(*), company_profile (*)')
        .eq('job_post_validity.is_published', true)
        .eq('uid', postData.job_uid);

      if (error) {
        throw error;
      }

      return data.length > 0 ? data[0] : null;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getResumeDetailsApi = async (postData) => {
    try {
      const response = await fetch('/api/profile/get-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: postData.uid,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          const data = responseData.data;
          return data.length > 0 ? data[0] : null;
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const getSingleCompanyProfileApi = async (postData) => {
    try {
      const response = await fetch('/api/profile/get-company-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: postData.uid,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          const data = responseData.data;
          return data.length > 0 ? data[0] : null;
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const updatePasswordApi = async ({ postData }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: postData.new_password,
      });

      if (error) {
        throw error;
      }

      toast.success('Password changed!');
      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAccountApi = async (postData) => {
    try {
      const { data, error } = await supabase
        .from('account_deletion')
        .insert({
          ...postData,
          user_uuid: mainData.user.data?.id,
        })
        .select();

      if (error) {
        throw error;
      }

      toast.success('Account deleted!');

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllChannelApi = async () => {
    try {
      const { data, error } = await supabase
        .from('channel')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        allChannel: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTopCompanyApi = async ({ limit: limit }) => {
    setMainData((prevData) => ({
      ...prevData,
      topCompanyProfile: {
        ...prevData.topCompanyProfile,
        isLoading: true,
      },
    }));

    try {
      let query = supabase
        .from('company_profile')
        .select('*, job_post (*)')
        .order('id', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        topCompanyProfile: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
      setMainData((prevData) => ({
        ...prevData,
        topCompanyProfile: {
          ...prevData.topCompanyProfile,
          isLoading: false,
        },
      }));
    }
  };

  const getAllCompanyApi = async (limit) => {
    try {
      let query = supabase
        .from('company_profile')
        .select('*, job_post (*)')
        .order('id', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setMainData((prevData) => ({
        ...prevData,
        allCompanyProfile: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addJobAlertApi = async (postData) => {
    try {
      const { data, error } = await supabase.from('job_alert').insert({
        ...postData,
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('Email already exists.');
          return null;
        } else {
          throw error;
        }
      }

      return true;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createStripeCustomerApi = async (postData) => {
    try {
      const response = await fetch('/api/stripe/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          email: mainData.profile.email,
          user_uuid: mainData.user.data?.id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          return responseData;
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const createStripeCheckoutSessionApi = async (postData) => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          user_uuid: mainData.user.data?.id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData) {
          return responseData;
        }
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred while processing the request');
    }
  };

  const promiseAllApi = async () => {
    await Promise.all([
      getProfileApi(),
      getNotificationApi(),
      getJobPostApi(),
      getResumeApi(),
      getCompanyProfileApi(),
      getApplicationApi(),
      getChannelApi(),
    ]);
  };

  const promiseAllPublicApi = async () => {
    await Promise.all([
      getTopJobPostApi({
        limit: 3,
      }),
      getTopCompanyApi({
        limit: 3,
      }),
      getAllCompanyApi(),
      getAllChannelApi(),
    ]);
  };

  useEffect(() => {
    const innitialFetch = async () => {
      if (mainData.user.data == null) {
        const userData = await getUserApi();
        if (!userData) {
          const isAuthPage = Object.values(PAGES).some(
            (page) => page?.directory === pathname && page?.isAuth
          );
          if (isAuthPage) {
            toast.error('Please login to continue.', {
              duration: 3000,
            });
            router.push(PAGES.home.directory);
          }
        }
      }
    };

    innitialFetch();
  }, [router.pathname]);

  useEffect(() => {
    promiseAllPublicApi();
  }, []);

  useEffect(() => {
    if (mainData.user.data !== null) {
      promiseAllApi();
    }
  }, [mainData.user.data]);

  const loginApi = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message === 'Email not confirmed') {
          toast.error(
            'Your email confirmation is pending, please check your inbox for the confirmation link.'
          );
        } else {
          throw error;
        }
      }

      return data?.user;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const signUpApi = async ({ username, email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL,
          data: {
            name: username,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        toast.error('User already exists!');
        return;
      }

      toast.success(
        'Thanks for signing up! please check your email to complete your registration.',
        {
          duration: 6000,
        }
      );

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetPasswordApi = async ({ currentEmail }) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        currentEmail,
        {
          redirectTo: process.env.NEXT_PUBLIC_UPDATE_PASSWORD_REDIRECT_URL,
        }
      );

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logoutApi = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('You have been logged out.');
      router.push(PAGES.home.directory);
      resetData();
    }
  };

  const clearData = async () => {
    router.push(PAGES.home.directory);
    resetData();
  };

  return (
    <ApiCallContext.Provider
      value={{
        apiData: mainData,
        clearData,
        loginApi,
        signUpApi,
        resetPasswordApi,
        logoutApi,
        getTopJobPostApi,
        getTopCompanyApi,
        getAllJobPostApi,
        getProfileApi,
        addNotificationApi,
        updateNotificationApi,
        getJobPostApi,
        addJobPostApi,
        editJobPostApi,
        deleteJobPostApi,
        publishJobPostApi,
        applyJobPostApi,
        getCompanyProfileApi,
        addCompanyProfileApi,
        editApplicationApi,
        getJobDetailsApi,
        getResumeDetailsApi,
        getSingleCompanyProfileApi,
        updatePasswordApi,
        deleteAccountApi,
        getResumeApi,
        addResumeApi,
        setMainData,
        updateProfileApi,
        updateAccountTypeApi,
        updateOnboardingApi,
        updateProductTourApi,
        getApplicationApi,
        createStripeCustomerApi,
        createStripeCheckoutSessionApi,
        addJobAlertApi,
      }}
    >
      {children}
    </ApiCallContext.Provider>
  );
};
