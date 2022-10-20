import asyncHandler from 'express-async-handler';
import sendResponse from '../utils/sendResponse.js';
import * as categoryHelpers from '../helpers/categoryHelpers.js';
import * as brandHelpers from '../helpers/brandHelpers.js';
import * as productHelpers from '../helpers/productHelpers.js';
import { findAllBanners } from '../helpers/bannerHelpers.js';
import AppError from '../utils/appError.js';
import { findReviewsByProductId } from '../helpers/reviewHelpers.js';

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

//@desc   get single brand data
//@route  GET /api/getbrand/:id
//@access public
const getBrandData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // throwing error if id is not present
  if (!id) {
    throw new AppError('Please send the id of the product', 400);
  }

  // Getting the brand details and the details of the products with that brandId
  const [products, brandDetails] = await Promise.all([
    productHelpers.findProductByBrandId(id),
    brandHelpers.findBrandByID(id)
  ]);

  // sending response data
  const resData = {
    status: 'success',
    data: { products, brandDetails }
  };
  sendResponse(200, resData, res);
});

//@desc   get single category data
//@route  GET /api/getcategory/:id
//@access public
const getCategoryData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // throwing error if id is not present
  if (!id) {
    throw new AppError('Please send the id of the product', 400);
  }

  // Getting the category details and the details of the products with that categoryId
  const [products, categoryDetails] = await Promise.all([
    productHelpers.findProductByCategoryId(id),
    categoryHelpers.findCategoryById(id)
  ]);

  // sending response
  const resData = {
    status: 'success',
    data: { products,categoryDetails }
  };
  sendResponse(200, resData, res);
});

//@desc   get single product data
//@route  GET /api/getproduct/:id
//@access public
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // throwing error if id is not present
  if (!id) {
    throw new AppError('Please send the id of the product', 400);
  }

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

//@desc   Get Category and Brand List
//@route  GET /api/getnavlist
//@access public
const getProductsAndCategories = asyncHandler(async (req, res) => {
  const categories = await categoryHelpers.findAllCategories();
  const products = await productHelpers.findProductNames();
  const resData = {
    status: 'success',
    data: { categories, products }
  };
  sendResponse(200, resData, res);
});

//@desc   Get all banners
//@route  GET /api/getallbanners
//@access public
const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await findAllBanners();
  const resData = {
    status: 'success',
    data: banners
  };
  sendResponse(200, resData, res);
});

//@desc   Search for a product
//@route  GET /api/searchproduct
//@access public
const handleSearch = asyncHandler(async (req, res) => {
  const products = await productHelpers.productSearch(req?.query?.search);
  const resData = {
    status: 'success',
    data: products
  };
  sendResponse(200, resData, res);
});

//@desc   Find similar products
//@route  GET /api/findsimilarproducts
//@access public
const getSimilarProducts = asyncHandler(async (req, res) => {
  // throw error if it does not exists
  if (!req?.query?.id) {
    throw new AppError('Please pass the Id of the product');
  }
  const products = await productHelpers.findSimilarProducts(req?.query?.id);
  const resData = {
    status: 'success',
    data: products
  };
  sendResponse(200, resData, res);
});

//@desc   Find the reviews for the product
//@route  GET /api/findproductreviews
//@access public
const getProductReviews = asyncHandler(async (req, res) => {
  // throw error if it does not exists
  if (!req?.query?.id) {
    throw new AppError('Please pass the Id of the product');
  }
  const [reviews] = await findReviewsByProductId(req?.query?.id);
  const resData = {
    status: 'success',
    data: reviews
  };
  sendResponse(200, resData, res);
});

export default {
  getAllProducts,
  getSingleProduct,
  getBrandsAndCategoryList,
  getProductsAndCategories,
  getAllBanners,
  handleSearch,
  getSimilarProducts,
  getProductReviews,
  getBrandData,
  getCategoryData
};
