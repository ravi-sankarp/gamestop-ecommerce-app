import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//get all user data
export const findAllUsers = asyncHandler(async () => {
  const users = await getDb().collection('users').find().project({ password: 0 }).toArray();
  return users;
});

//find total number of user
export const findTotalUsers = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        isAdmin: { $ne: true }
      }
    },
    {
      $group: {
        _id: null,
        totalUsers: {
          $sum: 1
        }
      }
    }
  ];
  const [count] = await getDb().collection('users').aggregate(agg).toArray();
  return count;
});

//create new user
export const createNewUser = asyncHandler(
  async (data) => await getDb().collection('users').insertOne(data)
);

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

//add new address field
export const insertNewAddress = asyncHandler(async (id, data) => {
  const _id = ObjectId(id);
  const addressId = new ObjectId();
  await getDb()
    .collection('users')
    .updateOne(
      { _id },
      {
        $push: {
          addresses: { ...data, id: addressId }
        }
      },
      {
        upsert: true
      }
    );
});

//edit existing addresh field
export const updateAddress = asyncHandler(async (id, adId, data) => {
  const _id = ObjectId(id);
  const addressId = ObjectId(adId);
  await getDb()
    .collection('users')
    .updateOne(
      { _id, 'addresses.id': addressId },
      {
        $set: {
          'addresses.$.name': data.name,
          'addresses.$.phoneNumber': data.phoneNumber,
          'addresses.$.houseName': data.houseName,
          'addresses.$.streetName': data.streetName,
          'addresses.$.city': data.city,
          'addresses.$.district': data.district,
          'addresses.$.state': data.state,
          'addresses.$.pincode': data.pincode
        }
      }
    );
});

//delete an existing address
export const deleteAddressById = asyncHandler(async (userId, adId) => {
  const _id = ObjectId(userId);
  const addressId = ObjectId(adId);
  await getDb()
    .collection('users')
    .updateOne(
      {
        _id
      },
      {
        $pull: {
          addresses: {
            id: addressId
          }
        }
      }
    );
});

// find by referral code
export const findUserByReferralCode = asyncHandler(async (id) => {
  const user = await getDb().collection('users').findOne({ 'referral.id': id });
  return user;
});

//update referal data
export const updateUserReferralDetails = asyncHandler(async (id, amount) => {
  const userId = ObjectId(id);
  await getDb()
    .collection('users')
    .updateOne({ _id: userId }, { $inc: { 'referral.count': 1, 'referral.amount': amount } });
});

//update verifed OTP
export const updateVerifiedOtp = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  await getDb()
    .collection('users')
    .updateOne({ _id: userId }, { $set: { verifiedOtp: true } });
});
