import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'js-cookie';
import moment from 'moment';
import { COUNTRIES, EMPLOYMENT_TYPES, SALARY_TYPES } from './constants';

export const generateUniqueID = () => {
  var timestamp = Date.now();
  var timestampString = timestamp.toString();
  var randomNumber = Math.random();
  var randomInteger = Math.floor(randomNumber);
  var randomString = randomInteger.toString().substring(0, 7);

  return timestampString + randomString;
};

export const findInArray = (array, property, value) => {
  return array.find((item) => item[property] === value);
};

export const getDisplayValue = (item, property, defaultValue = '-') => {
  return item?.[property] ?? defaultValue;
};

let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    // Get the value from local storage if it exists
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    // Save the value to local storage whenever it changes
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};

export const getCookie = (name) => {
  const cookie = Cookies.get(name);
  return cookie ? JSON.parse(cookie) : null;
};

export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, JSON.stringify(value), options);
};

export const checkCookie = async (cookieName, expiredTime = 15) => {
  if (cookieName) {
    const cookiesData = getCookie(cookieName);

    if (!cookiesData) {
      setCookie(cookieName, { timestamp: Date.now() }, { expires: 1 / 96 }); // 1/96 days = 15 minutes
      return true;
    }

    const { timestamp } = cookiesData;
    const currentTime = Date.now();
    const timeDiff = (currentTime - timestamp) / (1000 * 60);

    if (timeDiff > expiredTime) {
      setCookie(cookieName, { timestamp: currentTime }, { expires: 1 / 96 });
      return true;
    }

    return false;
  } else {
    return false;
  }
};

export const jobCardContent = (item) => {
  const jobData = {
    uid: item?.uid,
    status:
      item?.job_post_validity?.is_published == true ? 'publish' : 'unpublish',
    title: item.title,
    employmentType: EMPLOYMENT_TYPES.find(
      (type) => type.value === item?.employment_type
    )?.name,
    createdAt: moment(item?.created_at).fromNow(),
    salary: item?.min_salary
      ? `RM ${item?.min_salary} -  ${item?.max_salary} ${
          SALARY_TYPES.find((type) => type.value === item?.salary_type)?.name
        }`
      : 'Undisclosed',
    companyName: item.company_profile?.company_name,
    location: item.company_profile?.state
      ? `${
          item.company_profile?.state ? `${item.company_profile.state}, ` : ''
        }${
          COUNTRIES.find((type) => type.value === item.company_profile?.country)
            ?.name
        }`
      : '',
    requirements: item?.requirements ? item?.requirements : [],
    benefits: item?.benefits ? item?.benefits : [],
  };
  return jobData;
};

export const formatDisplayNumber = (number) => {
  if (number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(number % 1000000 === 0 ? 0 : 1) + 'M+';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(number % 1000 === 0 ? 0 : 1) + 'k+';
    } else {
      return number.toString();
    }
  }
};

export const useInternetConnectivity = () => {
  let online = false;

  try {
    online = window.navigator.onLine;
  } catch (error) {
    online = false;
  }

  return online ? true : false;
};
