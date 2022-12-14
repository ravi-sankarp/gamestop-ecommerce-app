import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

// get all the reviews by product id
export const findReviewsByProductId = asyncHandler(async (id) => {
  const productId = ObjectId(id);
  const reviews = await getDb().collection('reviews').find({ productId }).toArray();
  return reviews;
});

// add a new product review
export const addProductReview = asyncHandler(async (id, data) => {
  const productId = ObjectId(id);
  data.userId = ObjectId(data.userId);
  await getDb()
    .collection('reviews')
    .updateOne(
      { productId },
      {
        $push: {
          reviews: data
        }
      },
      {
        upsert:true
      }
    );
});

// find a review by user id
export const findReviewByUserId = asyncHandler(async (proId, usId) => {
  const userId = ObjectId(usId);
  const productId = ObjectId(proId);
  const result = await getDb()
    .collection('reviews')
    .findOne({ productId, 'reviews.userId': userId });
  return result;
});

// find the average rating of a product
export const findProductRatingAverage = asyncHandler(async (proId) => {
  const productId = ObjectId(proId);
  const agg = [
    {
      $match: {
        productId
      }
    },
    {
      $project: {
        average: {
          $avg: '$reviews.rating'
        }
      }
    }
  ];

  const [result] = await getDb().collection('reviews').aggregate(agg).toArray();
  return result;
});
