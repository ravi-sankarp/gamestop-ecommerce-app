import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

// Find All Offers
export const findAllOffers = asyncHandler(async () => {
  const result = await getDb().collection('offers').find({}).toArray();
  return result;
});

//Find All Category Offers
export const findAllCategoryOffers = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        type: 'Category Offer'
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    {
      $unwind: {
        path: '$categoryDetails',
        preserveNullAndEmptyArrays: false
      }
    }
  ];

  const result = await getDb().collection('offers').aggregate(agg).toArray();
  return result;
});

//Find All Product Offers
export const findAllProductOffers = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        type: 'Product Offer'
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    {
      $unwind: {
        path: '$productDetails',
        preserveNullAndEmptyArrays: false
      }
    }
  ];

  const result = await getDb().collection('offers').aggregate(agg).toArray();
  return result;
});

// find offer details by category Id
export const findOfferByCategoryId = asyncHandler(async (id) => {
  const categoryId = ObjectId(id);
  const result = await getDb().collection('offers').findOne({ categoryId });
  return result;
});

// find offer details by product Id
export const findOfferByProductId = asyncHandler(async (id) => {
  const productId = ObjectId(id);
  const result = await getDb().collection('offers').findOne({ productId });
  return result;
});

// Find Offer Details by Id
export const findOfferById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  const result = await getDb().collection('offers').findOne({ _id });
  return result;
});

// Add A new Offer
export const addNewOffer = asyncHandler(async (data, type) => {
  if (type === 'Category Offer') {
    data.categoryId = ObjectId(data.categoryId);
  } else {
    data.productId = ObjectId(data.productId);
  }
  await getDb().collection('offers').insertOne(data);
});

// Update an Offer
export const updateOfferById = asyncHandler(async (id, discount) => {
  const _id = ObjectId(id);

  await getDb().collection('offers').updateOne({ _id }, { $set: { discount } });
});

// Delete an Offer
export const deleteOfferById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  await getDb().collection('offers').deleteOne({ _id });
});
