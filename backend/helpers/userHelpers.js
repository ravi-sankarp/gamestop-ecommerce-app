import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//get all user data
export const findAllUsers = asyncHandler(async () => {
  const users = await getDb().collection('users').find().project({ password: 0 }).toArray();
  return users;
});

//create new user
export const createNewUser = asyncHandler(async (data) => {
  await getDb().collection('users').insertOne(data);
});
//find user details with ObjectId
export const findUserById = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  const user = await getDb().collection('users').findOne({ _id: userId });
  return user;
});

//find user details with Email
export const findUserByEmail = asyncHandler(async (email) => {
  const user = await getDb().collection('users').findOne({ email });
  return user;
});

//check if an email already exists
export const checkEmailAlreadyExists = asyncHandler(async (id, email) => {
  const userId = ObjectId(id);
  const user = await await getDb()
    .collection('users')
    .findOne({ _id: { $ne: userId }, email });
  return user;
});

//find user by Phone Number
export const findUserByPhoneNumber = asyncHandler(async (phoneNumber) => {
  const user = await getDb().collection('users').findOne({ phoneNumber });
  return user;
});

//check if Phone Number already exists
export const checkPhoneNumberAlreadyExists = asyncHandler(async (id, phoneNumber) => {
  const userId = ObjectId(id);
  const user = await getDb()
    .collection('users')
    .findOne({ _id: { $ne: userId }, phoneNumber });
  return user;
});

//update user data
export const updateUserById = asyncHandler(async (id, updatedData) => {
  const userId = ObjectId(id);
  await getDb()
    .collection('users')
    .updateOne({ _id: userId }, { $set: { ...updatedData } });
});

//block or unblock user
export const updateUserStatus = asyncHandler(async (id, status) => {
  const userId = ObjectId(id);
  await getDb()
    .collection('users')
    .updateOne({ _id: userId }, { $set: { isBlocked: status } });
});
