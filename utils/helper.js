import { loadStripe } from '@stripe/stripe-js';

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
