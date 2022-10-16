import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//Find all banners
export const findAllBanners = asyncHandler(async () => {
  const banners = await getDb().collection('banners').find().toArray();
  return banners;
});

//Find banner by Id
export const findBannerById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  const banner = await getDb().collection('banners').findOne({ _id });
  return banner;
});

//create a new banner
export const createNewBanner = asyncHandler(async (data) => {
  await getDb().collection('banners').insertOne(data);
});

//update an existing banner
export const updateBannerById = asyncHandler(async (id, data) => {
  const _id = ObjectId(id);
  await getDb().collection('banners').updateOne({ _id }, { data });
});

//delete an existing banner
export const deleteBannerById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  await getDb().collection('banners').deleteOne({ _id });
});
