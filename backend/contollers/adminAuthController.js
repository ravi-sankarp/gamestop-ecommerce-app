import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { getDb } from '../config/db.js';
import AppError from '../utils/appError.js';
import sendResponse from '../utils/sendResponse.js';

//function for signing JWT Tokens
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.JWT_EXPIRY });

//@desc   handle admin login
//@route  POST /api/admin/login
//@access public
const adminLogin = asyncHandler(async (req, res) => {
  //checking whether email and password is present
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please send all the data', 400);
  }

  const user = await getDb().collection('users').findOne({ email });
  //if account does not exists
  if (!user) {
    throw new AppError('Invalid credentials', 400);
  }
  //checking whether password matches
  else if (await bcrypt.compare(password, user.password)) {
    //check if user is an admin
    if (!user.isAdmin) {
      throw new AppError('You do not have permission to access this route', 403);
    }
    const data = {
      status: 'success',
      message: 'Login Successfull',
      token: generateToken(user._id),
      admin: true
    };
    sendResponse(200, data, res);
  } else {
    throw new AppError('Invalid credentials', 400);
  }
});

export default {
  adminLogin
};
