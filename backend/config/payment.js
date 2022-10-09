/* eslint-disable import/prefer-default-export */
import Razorpay from 'razorpay';
import Paypal from 'paypal-rest-sdk';

// razorpay instance
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

//  paypal instance
Paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET
});
export const paypal = Paypal;
