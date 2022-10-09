import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

// Add product to cart
export const addToCart = asyncHandler(async (id, proId) => {
  const userId = ObjectId(id);
  const productId = ObjectId(proId);
  await getDb()
    .collection('cart')
    .updateOne({ userId }, { $addToSet: { items: { productId, count: 1 } } }, { upsert: true });
});

//update product count in cart
export const updateProductCount = asyncHandler(async (id, proId, count) => {
  const userId = ObjectId(id);
  const productId = ObjectId(proId);
  await getDb()
    .collection('cart')
    .updateOne({ userId, 'items.productId': productId }, { $inc: { 'items.$.count': count } });
});

//check if product exists in cart
export const checkProductExists = asyncHandler(async (id, proId) => {
  const userId = ObjectId(id);
  const productId = ObjectId(proId);
  const cart = await getDb().collection('cart').findOne({ userId, 'items.productId': productId });
  return cart;
});

//delete product from cart
export const removeFromCart = asyncHandler(async (id, proId) => {
  const userId = ObjectId(id);
  const productId = ObjectId(proId);
  const result = await getDb()
    .collection('cart')
    .findOneAndUpdate({ userId }, { $pull: { items: { productId } } });
  if (!result?.items?.length) {
    await getDb()
      .collection('cart')
      .deleteOne({ items: { $exists: true, $size: 0 } });
  }
});

//find cart details
export const findCartByUserId = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  const agg = [
    {
      $match: {
        userId
      }
    },
    {
      $unwind: {
        path: '$items',
        preserveNullAndEmptyArrays: false
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
            productDetails: '$product',
            count: '$items.count',
            subTotal: {
              $sum: {
                $multiply: ['$items.count', '$product.discountedPrice']
              }
            }
          }
        },
        total: {
          $sum: {
            $multiply: ['$items.count', '$product.price']
          }
        },
        discountedTotal: {
          $sum: {
            $multiply: ['$items.count', '$product.discountedPrice']
          }
        }
      }
    }
  ];
  const cart = await getDb().collection('cart').aggregate(agg).toArray();
  return cart;
});

//find the number of products in cart
export const findCartCount = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  const agg = [
    {
      $match: {
        userId
      }
    },
    {
      $project: {
        cartCount: {
          $size: '$items'
        }
      }
    }
  ];

  const count = await getDb().collection('cart').aggregate(agg).toArray();
  return count[0];
});

//find total amount in cart
export const findCartTotalByUserId = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  const agg = [
    {
      $match: {
        userId
      }
    },
    {
      $unwind: {
        path: '$items',
        preserveNullAndEmptyArrays: false
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
            productDetails: '$product',
            count: '$items.count',
            subTotal: {
              $sum: {
                $multiply: ['$items.count', '$product.discountedPrice']
              }
            }
          }
        },
        total: {
          $sum: {
            $multiply: ['$items.count', '$product.price']
          }
        },
        discountedTotal: {
          $sum: {
            $multiply: ['$items.count', '$product.discountedPrice']
          }
        }
      }
    },
    {
      $project: {
        totalProducts: {
          $size: '$items'
        },
        total: 1,
        discountedTotal: 1,
        _id: 0
      }
    }
  ];

  const result = await getDb().collection('cart').aggregate(agg).toArray();
  return result[0];
});

//remove the cart fully
export const deleteCartByUserId = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  await getDb().collection('cart').deleteOne({ userId });
});
