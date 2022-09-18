import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';
import sendResponse from '../utils/sendResponse.js';

//@desc   get all products
//@route  GET /api/getproducts
//@access public
const getAllProducts = asyncHandler(async (req, res) => {
  const agg = [
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand'
      }
    }
  ];

  const products = await getDb().collection('products').aggregate(agg).toArray();

  const resData = {
    status: 'success',
    data: [...products]
  };
  sendResponse(200, resData, res);
});

//@desc   get single product data
//@route  GET /api/getproduct/:id
//@access public
const getSingleProduct = asyncHandler(async (req, res) => {
  const id = ObjectId(req.params.id);
  const agg = [
    {
      $match: { _id: id }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand'
      }
    }
  ];

  const product = await getDb().collection('products').aggregate(agg).toArray();
  const resData = {
    status: 'success',
    data: { ...product[0] }
  };
  sendResponse(200, resData, res);
});
export default {
  getAllProducts,
  getSingleProduct
};
