import validator from 'validator';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

import AppError from '../utils/appError.js';
import sendResponse from '../utils/sendResponse.js';
import { sendOtp, verifyOtp } from '../utils/otpHelper.js';
import {
  generateRefreshToken,
  generateToken,
  generateTokenWithRefreshToken
} from '../utils/jwtHelper.js';
import { createNewUser, findUserByEmail, findUserByPhoneNumber } from '../helpers/userHelpers.js';

//function for hashing user passords
export const hashPassword = async (pwd) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPwd = await bcrypt.hash(pwd, salt);
    return hashedPwd;
  } catch (err) {
    console.error(err);
    throw new AppError('Something went wrong please try again', 500);
  }
};

//function for verifying user login
export const verifyUserLogin = asyncHandler(async (req) => {
  //checking whether email and password is present
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please send all the data', 400);
  }
  const user = await findUserByEmail(email.toLowerCase().trim());

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
    return user;
  } else {
    throw new AppError('Invalid credentials', 400);
  }
});

//@desc   handle user login
//@route  POST /api/auth/login
//@access public
const userLogin = asyncHandler(async (req, res) => {
  const user = await verifyUserLogin(req);
  const data = {
    status: 'success',
    token: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
    message: 'Login successfull',
    admin: user.isAdmin
  };
  sendResponse(200, data, res);
});

//@desc   handle User Registration
//@route  POST /api/auth/register
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
  const userCheckEmail = await findUserByEmail(modifiedEmail);
  if (userCheckEmail) {
    throw new AppError('Email already exists', 409);
  }

  //checking if phone number already exists
  const userCheckPhoneNumber = await findUserByPhoneNumber(modifiedNumber);
  if (userCheckPhoneNumber) {
    throw new AppError('Phone number already exists', 409);
  }
  email.toLowerCase().trim();
  const hashedPwd = await hashPassword(password);
  const result = await createNewUser({
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
    refreshToken: generateRefreshToken(result.insertedId),
    message: 'Successfully created your account'
  };
  sendResponse(201, data, res);
});

//@desc   request OTP for login
//@route  GET /api/auth/requestotp
//@access public
const requestOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    throw new AppError('Please send all the necessary data', 400);
  }
  const check = await findUserByPhoneNumber(phoneNumber.trim());
  if (!check) {
    throw new AppError('You does not have an account! Please create an account first', 400);
  }
  sendOtp(req, res);
});

//@desc   verify OTP for login
//@route  GET /api/auth/verifyotp
//@access public
const verifyUserOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, code } = req.body;
  if (!phoneNumber || !code) {
    throw new AppError('Please send both the phone number and otp', 400);
  }
  const result = await verifyOtp(phoneNumber, code);
  if (result.status === 'approved') {
    const user = await findUserByPhoneNumber(phoneNumber.trim());

    //checking if user is blocked or not
    if (user.isBlocked) {
      throw new AppError('Your Account is currently blocked', 403);
    }
    const data = {
      status: 'success',
      message: 'Login Successfull',
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
      admin: user.isAdmin
    };
    sendResponse(200, data, res);
  } else {
    throw new AppError('Otp verification failed! Please try again', 400);
  }
});

//@desc   handle refresh token request
//@route  GET /api/auth/refreshtoken
//@access public
const handleRefreshToken = asyncHandler(async (req, res) => {
  const { token, refreshToken, isAdmin } = await generateTokenWithRefreshToken(req);
  const data = {
    status: 'success',
    message: 'Generated Token',
    token: token,
    refreshToken: refreshToken,
    admin: isAdmin
  };
  sendResponse(200, data, res);
});

//@desc   verify admin login
//@route  GET /api/auth/adminlogin
//@access public
const adminLogin = asyncHandler(async (req, res) => {
  const user = await verifyUserLogin(req);
  if (user.isAdmin) {
    const data = {
      status: 'success',
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id),
      message: 'Login successfull',
      admin: user.isAdmin
    };
    sendResponse(200, data, res);
  } else {
    throw new AppError('Not Authorized to access this route', 403);
  }
});

export default {
  userLogin,
  registerUser,
  requestOtp,
  verifyUserOtp,
  handleRefreshToken,
  adminLogin
};
