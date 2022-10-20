/* eslint-disable no-else-return */
import { promisify } from 'util';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import AppError from './appError.js';
import { getDb } from '../config/db.js';

const changedPasswordAfter = (user, JwtTimestamp) => {
  if (user.passwordChangedAt) {
    const passwordChangedAt = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    return JwtTimestamp < passwordChangedAt;
  }
  return false;
};

//verify jwt token
export const jwtVerify = asyncHandler(async (req, secret) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new AppError('Please Login first', 401);
    }
    //verifying token
    const decoded = await promisify(jwt.verify)(
      token,
      secret || process.env.JWT_ACCESS_TOKEN_SECRET
    );

    //checking if user still exists
    const currentUser = await getDb()
      .collection('users')
      .findOne({ _id: ObjectId(decoded.id) });
    if (!currentUser) {
      throw new AppError('The user no longer exists', 401);
    }

    //checking if user is disabled or not
    if (currentUser.isBlocked) {
      throw new AppError('Your Account is currently blocked', 403);
    }

    //checking if user has changed password after the token was issued
    if (changedPasswordAfter(currentUser, decoded.iat)) {
      throw new AppError('User recently changed password! Login again', 401);
    }
    currentUser.password = undefined;
    return currentUser;
  } else {
    throw new AppError('Please Login first', 401);
  }
});

//Sign JWT Tokens
export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY
  });

//Sign JWT Refresh Token
export const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY
  });

//Generate New Token with refresh Token
export const generateTokenWithRefreshToken = asyncHandler(async (req) => {
  const user = await jwtVerify(req, process.env.JWT_REFRESH_TOKEN_SECRET);
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  return {
    token,
    refreshToken,
    isAdmin: user.isAdmin,
    googleAuth:user.googleAuth
  };
});
