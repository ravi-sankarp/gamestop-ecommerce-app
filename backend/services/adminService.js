import asyncHandler from 'express-async-handler';
import { getDb } from '../config/db.js';

//get all user data
export const findAllUsers = asyncHandler(async () => {
  const users = await getDb()
    .collection('users')
    .find({ isAdmin: false })
    .project({ password: 0 })
    .toArray();
  return users;
});

