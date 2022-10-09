import asyncHandler from 'express-async-handler';
import client from '../config/twilio.js';
import sendResponse from './sendResponse.js';

//for sending otp
export const sendOtp = asyncHandler(async (req, res) => {
  const serviceId = process.env.TWILIO_SERVICE_ID;
  await client.verify.v2.services(serviceId).verifications.create({
    to: `+91${req.body.phoneNumber}`,
    channel: 'sms'
  });
  const resData = {
    status: 'sucess',
    message: 'Otp sent to phone number'
  };
  sendResponse(200, resData, res);
});

//verifying otp
export const verifyOtp = asyncHandler(async (phoneNumber, code) => {
  const serviceId = process.env.TWILIO_SERVICE_ID;
  const result = await client.verify.v2
    .services(serviceId)
    .verificationChecks.create({ to: `+91${phoneNumber}`, code });
  return result;
});
