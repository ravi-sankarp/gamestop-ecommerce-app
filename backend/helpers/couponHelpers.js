import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//Find all coupons
export const findAllCoupons = asyncHandler(async () => {
  const coupons = await getDb().collection('coupons').find().toArray();
  return coupons;
});

//Find a coupon by its code
export const findByCouponCode = asyncHandler(async (code) => {
  const coupon = await getDb().collection('coupons').findOne({ code });
  return coupon;
});

//Find a coupon by its ID
export const findCouponById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  const coupon = await getDb().collection('coupons').findOne({ _id });
  return coupon;
});

// Check if a user has already applied the coupon
export const checkIfCouponAlreadyUsed = asyncHandler(async (code, id) => {
  const userId = ObjectId(id);
  const result = await getDb().collection('coupons').findOne({ code, 'users.userId': userId });
  return result;
});

// create new coupon
export const createNewCoupon = asyncHandler(async (data) => {
  await getDb().collection('coupons').insertOne(data);
});

// edit a coupon
export const updateCouponById = asyncHandler(async (id, data) => {
  const _id = ObjectId(id);
  await getDb()
    .collection('coupons')
    .updateOne({ _id }, { $set: { ...data } });
});

// Add the userId to users list when user has applied coupon
export const addUserToCouponAppliedList = asyncHandler(async (code, id) => {
  const userId = ObjectId(id);
  await getDb()
    .collection('coupons')
    .updateOne({ code }, { $addToSet: { users: userId } });
});

// delete a coupon
export const deleteCouponById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  await getDb().collection('coupons').deleteOne({ _id });
});
