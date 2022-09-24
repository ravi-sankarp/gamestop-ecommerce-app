import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError.js';
import { jwtVerify } from '../utils/jwtHelper.js';

//Middleware for verifying JWT Token
export const protect = asyncHandler(async (req, res, next) => {
  const user = await jwtVerify(req);
  req.userDetails = user;
  next();
});

//Middleware for verifying admin
export const checkAdmin = asyncHandler(async (req, res, next) => {
  if (!req.userDetails.isAdmin) {
    throw new AppError('You do not have permission to access this route', 403);
  }
  next();
});
