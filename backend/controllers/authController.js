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
import {
  createNewUser,
  findUserByEmail,
  findUserByPhoneNumber,
  findUserByReferralCode,
  updateUserById,
  updateUserReferralDetails,
  updateVerifiedOtp
} from '../services/userService.js';
import { createNewWallet, updateWalletBalance } from '../services/walletService.js';
import asyncRandomBytes from '../utils/asyncRandomBytes.js';
import { createNewPayment } from '../services/paymentService.js';
import client from '../config/googleAuth.js';


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

  // if user has logged in with their google account then throw an error
  if (user.googleAuth) {
    throw new AppError('You have signed in with your google account', 400);
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
    admin: user.isAdmin,
    googleAuth: false
  };
  sendResponse(200, data, res);
});

//@desc   handle login with google
//@route  POST /api/auth/googlelogin
//@access public
const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  // throw error if credentials was not found
  if (!token) {
    throw new AppError('Please provide the credentials', 400);
  }

  // verify the token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const { name, email, sub } = ticket.getPayload();

  // if data was not send then throw an error
  if (!name || !email) {
    throw new AppError(`Please provide your ${name ? 'email' : 'full name'}`, 400);
  }

  // check if user already exists
  const user = await findUserByEmail(email);

  // to save user id
  let userId;

  // to set redirect url to profile tab if the user is new
  let redirectUrl;

  // if user exists then directly login the user
  if (user) {
    // check if the user has used google for signing in
    if (!user.googleAuth) {
      throw new AppError(
        'You have not signed in with google ! Please use normal login method',
        400
      );
    }

    // check if user is currently blocked
    if (user.isBlocked) {
      throw new AppError('Your account is currently blocked', 403);
    }
    // save the user id to generate token
    userId = user._id;
  } else {
    // add user data to database
    // create a referal code for the user
    const code = (await asyncRandomBytes(6)).toString('hex');
    const { insertedId } = await createNewUser({
      email,
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1],
      googleId: sub,
      referral: {
        id: code,
        count: 0,
        amount: 0
      },
      isBlocked: false,
      isAdmin: false,
      googleAuth: true
    });
    userId = insertedId;
    redirectUrl = '/profile?profile=info';

    // create userwallet
    // create a wallet for the user
    await createNewWallet(insertedId);
  }

  const data = {
    status: 'success',
    token: generateToken(userId),
    refreshToken: generateRefreshToken(userId),
    message: 'Login successfull',
    admin: false,
    googleAuth: true,
    redirectUrl
  };
  sendResponse(200, data, res);
});

//@desc   handle User Registration
//@route  POST /api/auth/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, phoneNumber, referralCode } =
    req.body;

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
    if (userCheckEmail.googleAuth) {
      throw new AppError('You have signed in with your google account', 409);
    }
    throw new AppError('Email already exists', 409);
  }

  //checking if phone number already exists
  const userCheckPhoneNumber = await findUserByPhoneNumber(modifiedNumber);
  if (userCheckPhoneNumber) {
    throw new AppError('Phone number already exists', 409);
  }
  email.toLowerCase().trim();
  const hashedPwd = await hashPassword(password);

  const isReferred = {
    status: false,
    userId: null
  };
  // check if referral code is valid
  if (referralCode) {
    // checking if referred user exists
    const result = await findUserByReferralCode(referralCode);
    if (!result) {
      throw new AppError('Invalid referral code', 400);
    }
    isReferred.status = true;
    isReferred.userId = result._id;
  }

  // create a referal code for the user
  const code = (await asyncRandomBytes(6)).toString('hex');
  const result = await createNewUser({
    email: modifiedEmail,
    firstName,
    lastName,
    referral: {
      id: code,
      count: 0,
      amount: 0
    },
    phoneNumber: modifiedNumber,
    password: hashedPwd,
    isBlocked: false,
    isAdmin: false
  });

  // sending token as response
  const data = {
    status: 'success',
    token: generateToken(result.insertedId),
    refreshToken: generateRefreshToken(result.insertedId),
    message: 'Successfully created your account',
    googleAuth: false
  };
  sendResponse(201, data, res);

  // create a wallet for the user
  await createNewWallet(result.insertedId);

  // if user was referred then add some amount to the user wallet
  if (isReferred.status) {
    const paymentIdNewUser = (await asyncRandomBytes(6)).toString('hex');
    const paymentIdReferredUser = (await asyncRandomBytes(6)).toString('hex');
    const paymentDataNewUser = {
      paymentId: paymentIdNewUser,
      operation: 'Referral Bonus',
      mode: 'debit',
      amount: 100,
      status: 'success',
      method: 'Wallet Transfer'
    };
    const paymentDataReferredUser = {
      paymentId: paymentIdReferredUser,
      operation: 'Referral Bonus',
      mode: 'debit',
      amount: 100,
      status: 'success',
      method: 'Wallet Transfer'
    };
    const walletDataNewUser = {
      operation: 'Referral Bonus',
      paymentId: paymentIdNewUser,
      mode: 'credit',
      amount: 100
    };
    const walletDataReferredUser = {
      operation: 'Referral Bonus',
      paymentId: paymentIdNewUser,
      mode: 'credit',
      amount: 100
    };
    await Promise.all([
      createNewPayment(result.insertedId, null, paymentDataNewUser),
      createNewPayment(isReferred.userId, null, paymentDataReferredUser),
      updateWalletBalance(result.insertedId, walletDataNewUser),
      updateWalletBalance(isReferred.userId, walletDataReferredUser),
      updateUserReferralDetails(isReferred.userId, 100)
    ]);
  }
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
  const { phoneNumber, code, method } = req.body;
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
    if (method === 'Forgot Password') {
      await updateVerifiedOtp(user._id);
      const data = {
        status: 'success',
        message: 'Otp Verification Successfull'
      };
      sendResponse(200, data, res);
    } else {
      const data = {
        status: 'success',
        message: 'Login Successfull',
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id),
        admin: user.isAdmin,
        googleAuth: user.googleAuth
      };
      sendResponse(200, data, res);
    }
  } else {
    throw new AppError('Otp verification failed! Please try again', 400);
  }
});

//@desc   handle refresh token request
//@route  GET /api/auth/refreshtoken
//@access public
const handleRefreshToken = asyncHandler(async (req, res) => {
  const { token, refreshToken, isAdmin,googleAuth } = await generateTokenWithRefreshToken(req);
  const data = {
    status: 'success',
    message: 'Generated Token',
    token: token,
    refreshToken: refreshToken,
    admin: isAdmin,
    googleAuth
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

//@desc   Forgot password request
//@route  GET /api/auth/forgotpassword
//@access public
const handleForgotPassword = asyncHandler(async (req, res) => {
  const { email, phoneNumber } = req.body;

  // checking if data exists
  if (!email || !phoneNumber) {
    throw new AppError('Please send all the required data', 400);
  }

  // find the data of the requested user
  const user = await findUserByEmail(email.toLowerCase().trim());

  // if no user was found
  if (!user) {
    throw new AppError('Cannot find any user with this email address', 400);
  }

  // if user has signed in with google account then throw an error
  if (user.googleAuth) {
    throw new AppError('You have signed in with your google account !', 400);
  }

  // checking if phonenumber matches the current user
  if (phoneNumber.trim() !== user.phoneNumber) {
    throw new AppError('Email and phone number does not match', 400);
  }

  // sending the otp
  sendOtp(req, res);
});

//@desc   Change password of the user
//@route  PUT /api/auth/changeuserpassword
//@access private
const handleChangePassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmNewPassword, phoneNumber } = req.body;

  // checking if all the data exists
  if (!newPassword || !confirmNewPassword || !phoneNumber) {
    throw new AppError('Please send all the required data !', 400);
  }

  // checking if new password and confirm new password
  if (newPassword !== confirmNewPassword) {
    throw new AppError('Passwords does not match', 400);
  }

  // finding user details by email address
  const user = await findUserByPhoneNumber(phoneNumber.trim());

  // if user does not exist
  if (!user) {
    throw new AppError('Cannot a find a user with this email address', 400);
  }

  // check if OTP was verifed
  if (!user?.verifiedOtp) {
    throw new AppError('OTP was not verified ! Verify OTP first', 400);
  }

  // hashing new password
  const hashedPwd = await hashPassword(newPassword);
  const updatedData = {
    password: hashedPwd,
    verifiedOtp: false,
    passwordChangedAt: new Date()
  };
  await updateUserById(user._id, updatedData);

  const resData = {
    status: 'success',
    message: 'Successfully updated your password',
    token: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
    admin: user.isAdmin
  };
  sendResponse(200, resData, res);
});

export default {
  userLogin,
  registerUser,
  requestOtp,
  verifyUserOtp,
  handleRefreshToken,
  adminLogin,
  googleLogin,
  handleForgotPassword,
  handleChangePassword
};
