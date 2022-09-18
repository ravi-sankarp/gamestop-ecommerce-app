import validator from 'validator';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { getDb } from '../config/db.js';
import AppError from '../utils/appError.js';
import sendResponse from '../utils/sendResponse.js';
import { sendOtp, verifyOtp } from '../utils/otpHelper.js';

//function for hashing user passords
const hashPassword = async (pwd) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPwd = await bcrypt.hash(pwd, salt);
    return hashedPwd;
  } catch (err) {
    console.error(err);
  }
};

//function for signing JWT Tokens
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.JWT_EXPIRY });

//@desc   handle user login
//@route  POST /api/user/login
//@access public
const userLogin = asyncHandler(async (req, res) => {
  //checking whether email and password is present
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please send all the data', 400);
  }
  email.toLowerCase().trim();
  const user = await getDb().collection('users').findOne({ email });
  //if account does not exists
  if (!user) {
    throw new AppError('Account does not exist ! Please create a new account', 400);
  }
  //checking whether password matches
  else if (await bcrypt.compare(password, user.password)) {
    //check if user is active
    if (user.isBlocked) {
      throw new AppError('Your Account is currently blocked', 403);
    }
    const data = {
      status: 'success',
      token: generateToken(user._id),
      message: 'Login successfull',
      admin: false
    };
    sendResponse(200, data, res);
  } else {
    throw new AppError('Invalid credentials', 400);
  }
});

//@desc   handle User Registration
//@route  POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, phoneNumber } = req.body;

  //checking if entered data is valid
  if (!email || !password || !firstName || !lastName || !phoneNumber || !confirmPassword) {
    throw new AppError('Please enter all fields', 400);
  }
  if (password !== confirmPassword) {
    throw new AppError(`Passwords doesn't match`, 400);
  }
  if (!validator.isEmail(email)) {
    throw new AppError('Please enter a valid email address', 400);
  }
  if (!validator.isMobilePhone(phoneNumber, 'en-IN')) {
    throw new AppError('Please enter a valid phone number', 400);
  }

  const modifiedEmail = email.toLowerCase().trim();
  const modifiedNumber = phoneNumber.trim();
  //checking if email already exists
  const userCheckEmail = await getDb().collection('users').findOne({ email: modifiedEmail });
  if (userCheckEmail) {
    throw new AppError('Email already exists', 409);
  }

  //checking if phone number already exists
  const userCheckPhoneNumber = await getDb()
    .collection('users')
    .findOne({ phoneNumber: modifiedNumber });
  if (userCheckPhoneNumber) {
    throw new AppError('Phone number already exists', 409);
  }
  email.toLowerCase().trim();
  const hashedPwd = await hashPassword(password);
  const result = await getDb().collection('users').insertOne({
    email: modifiedEmail,
    firstName,
    lastName,
    phoneNumber: modifiedNumber,
    password: hashedPwd,
    isBlocked: false,
    isAdmin: false
  });
  const data = {
    status: 'success',
    token: generateToken(result.insertedId),
    message: 'Successfully created your account',
    admin: false
  };
  sendResponse(201, data, res);
});

//@desc   request OTP for login
//@route  GET /api/requestotp
//@access public
const requestOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  const check = await getDb().collection('users').findOne({ phoneNumber });
  if (!check) {
    throw new AppError('You does not have an account! Please create an account first', 400);
  }
  sendOtp(req, res);
});

//@desc   verify OTP for login
//@route  GET /api/verifyotp
//@access public
const verifyUserOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, code } = req.body;
  if (!phoneNumber || !code) {
    throw new AppError('Please send both the phone number and otp', 400);
  }
  const result = await verifyOtp(phoneNumber, code);
  if (result.status === 'approved') {
    const user = await getDb().collection('users').findOne({ phoneNumber });
    const data = {
      status: 'success',
      message: 'Login Successful',
      token: generateToken(user._id),
      admin: false
    };
    sendResponse(200, data, res);
  } else {
    throw new AppError('Otp verification failed! Please try again', 400);
  }
});
export default {
  userLogin,
  registerUser,
  requestOtp,
  verifyUserOtp
};
