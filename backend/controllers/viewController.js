import asyncHandler from 'express-async-handler';
import sendResponse from '../utils/sendResponse.js';
import * as categoryHelpers from '../helpers/categoryHelpers.js';
import * as brandHelpers from '../helpers/brandHelpers.js';
import * as productHelpers from '../helpers/productHelpers.js';

//@desc   get all products
//@route  GET /api/getproducts
//@access public
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productHelpers.findAllProducts(req.query);

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
  const { id } = req.params;

  const product = await productHelpers.findProductByIdAggregation(id);
  const resData = {
    status: 'success',
    data: { ...product }
  };
  sendResponse(200, resData, res);
});

//@desc   Get Category and Brand List
//@route  GET /api/getnavlist
//@access public
const getBrandsAndCategoryList = asyncHandler(async (req, res) => {
  const categories = await categoryHelpers.findAllCategories();
  const brands = await brandHelpers.findAllBrands();
  const resData = {
    status: 'success',
    brands,
    categories
  };
  sendResponse(200, resData, res);
});
export default {
  getAllProducts,
  getSingleProduct,
  getBrandsAndCategoryList
};
