import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

// Add product to wishlist
export const addToWishlist = asyncHandler(async (id, proId) => {
  const userId = ObjectId(id);
  const productId = ObjectId(proId);
  await getDb()
    .collection('wishlist')
    .updateOne({ userId }, { $addToSet: { items: { productId } } }, { upsert: true });
});

//check if product exists in wishlist
export const checkProductExistsInWishlist = asyncHandler(async (id, proId) => {
  const userId = ObjectId(id);
  const productId = ObjectId(proId);
  const wishlist = await getDb()
    .collection('wishlist')
    .findOne({ userId, 'items.productId': productId });
  return wishlist;
});

//delete product from wishlist
export const removeFromWishlist = asyncHandler(async (id, proId) => {
  const userId = ObjectId(id);
  const productId = ObjectId(proId);
  const result = await getDb()
    .collection('wishlist')
    .findOneAndUpdate({ userId }, { $pull: { items: { productId } } });
  if (!result?.items?.length) {
    await getDb()
      .collection('wishlist')
      .deleteOne({ items: { $exists: true, $size: 0 } });
  }
});

//find wishlist details
export const findWishlistByUserId = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  const agg = [
    {
      $match: {
        userId
      }
    },
    {
      $unwind: {
        path: '$items'
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $project: {
        userId: '$userId',
        items: '$items',
        product: {
          $arrayElemAt: ['$product', 0]
        }
      }
    },
    {
      $group: {
        _id: '$userId',
        items: {
          $push: {
            productDetails: '$product'
          }
        }
      }
    }
  ];
  const wishlist = await getDb().collection('wishlist').aggregate(agg).toArray();
  return wishlist;
});

//find the number of products in wishlist
export const findWishlistCountByUserId = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  const agg = [
    {
      $match: {
        userId
      }
    },
    {
      $project: {
        wishlistCount: {
          $size: '$items'
        }
      }
    }
  ];

  const count = await getDb().collection('wishlist').aggregate(agg).toArray();
  return count[0];
});
