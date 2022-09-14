import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';
import AppError from '../utils/appError.js';

/*function for checking whether user has changed password
after the token was issued
returns true if password was changed
*/
const changedPasswordAfter = (user, JwtTimestamp) => {
  if (user.passwordChangedAt) {
    return JwtTimestamp < user.passwordChangedAt;
  }
  return false;
};

//Middleware for verifying JWT Token
export const protect = asyncHandler(async (req, res, next) => {
  //checking if bearer token exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new AppError('Please Login first', 401);
    }

    //verifying token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_ACCESS_TOKEN);
    //checking if user still exists
    const currentUser = await getDb()
      .collection('users')
      .findOne({ _id: ObjectId(decoded.id) });
    if (!currentUser) {
      throw new AppError('The user no longer exists', 401);
    }

    //checking if user has changed password after the token was issued
    if (changedPasswordAfter(currentUser, decoded.iat)) {
      throw new AppError('User recently changed password! Login again', 401);
    }
    req.userDetails = currentUser;
    next();
  } else {
    throw new AppError('Please Login first', 401);
  }
});

//Middleware for verifying admin
export const checkAdmin = asyncHandler(async (req, res, next) => {
  if (!req.userDetails.isAdmin) {
    throw new AppError('You do not have permission to access this route', 403);
  }
  next();
});
