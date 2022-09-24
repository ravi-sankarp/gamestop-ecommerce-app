import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';
import { deleteProductsByBrandId } from './productHelpers.js';

//Get all brands details
export const findAllBrands = asyncHandler(async () => {
  const agg = [
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'brandId',
        as: 'products'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        bannerImg: 1,
        totalProducts: {
          $size: '$products'
        }
      }
    }
  ];
  const brands = await getDb().collection('brands').aggregate(agg).toArray();
  return brands;
});

//Get all brands details
export const finBrandByID = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  const brands = await getDb().collection('brands').findOne({ _id });
  return brands;
});

//Checking if brand name exists or not
export const checkBrandNameExists = asyncHandler(async (id, name) => {
  const objId = ObjectId(id);
  const brand = await getDb()
    .collection('brands')
    .findOne({ _id: { $ne: objId }, name: { $regex: `^${name.trim()}$`, $options: 'i' } });
  console.log({ brand });
  return brand;
});

//Creating a new Brand
export const createNewBrand = asyncHandler(async (data) => {
  await getDb().collection('brands').insertOne(data);
});

//Updating an existing Brand
export const updateBrandById = asyncHandler(async (id, data) => {
  const _id = ObjectId(id);
  await getDb()
    .collection('brands')
    .updateOne({ _id }, { $set: { ...data } });
});

//Delete an existing Brand and products belonging to that brand
export const deleteBrandById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  await getDb().collection('brands').deleteOne({ _id });
  await deleteProductsByBrandId(id);
});
