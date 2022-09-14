import asyncHandler from 'express-async-handler';
import { ObjectId, Int32, Timestamp } from 'mongodb';
import validator from 'validator';
import { getDb } from '../config/db.js';
import AppError from '../utils/appError.js';
import sendResponse from '../utils/sendResponse.js';
import { cloudinarySingleUpload } from '../utils/uploadToCloudinary.js';

//@desc   get all user data
//@route  GET /api/admin/getusers
//@access private
const listUsers = asyncHandler(async (req, res) => {
  const users = await getDb().collection('users').find().project({ password: 0 }).toArray();
  const resData = {
    status: 'success',
    data: users
  };
  sendResponse(200, resData, res);
});

//@desc   edit user data
//@route  PUT /api/admin/edituser/:id
//@access private
const editUser = asyncHandler(async (req, res) => {
  const userId = ObjectId(req.params.id);
  const userData = await getDb().collection('users').findOne({ _id: userId });

  //checking if id was valid
  if (!userData) {
    throw new AppError('Cannot find user! Invalid ID', 400);
  }

  //getting data from request body
  const updatedData = {
    firstName: req.body.firstName || userData.firstName,
    lastName: req.body.lastName || userData.lastName,
    email: req.body.email.toLowerCase().trim() || userData.email,
    phoneNumber: req.body.phoneNumber || userData.phoneNumber
  };

  console.log({ updatedData });
  //checking if email is valid
  if (!validator.isEmail(updatedData.email)) {
    throw new AppError('Please enter a valid email address', 400);
  }
  if (!validator.isMobilePhone(updatedData.phoneNumber, 'en-IN')) {
    throw new AppError('Please enter a valid phone number', 400);
  }

  //checking if email already exists
  const userCheckEmail = await getDb()
    .collection('users')
    .findOne({ _id: { $ne: userId }, email: updatedData.email });
  if (userCheckEmail) {
    throw new AppError('Email already exists', 409);
  }

  //checking if phone number already exists
  const userCheckPhoneNumber = await getDb()
    .collection('users')
    .findOne({ _id: { $ne: userId }, phoneNumber: updatedData.phoneNumber });
  if (userCheckPhoneNumber) {
    throw new AppError('Phone number already exists', 409);
  }

  //updating data to database
  await getDb()
    .collection('users')
    .updateOne({ _id: userId }, { $set: { ...updatedData } });
  const resData = {
    status: 'success',
    message: 'successfully updated user data'
  };
  sendResponse(200, resData, res);
});

//@desc   block/unblock a user
//@route  GET /api/admin/changeuserstatus/:id
//@access private
const changeUserStatus = asyncHandler(async (req, res) => {
  const userId = ObjectId(req.params.id);
  const user = await getDb().collection('users').findOne({ _id: userId });
  if (!user) {
    throw new AppError('User does not exist', 400);
  }
  const changedStatus = !user.isBlocked;
  await getDb()
    .collection('users')
    .updateOne({ _id: userId }, { $set: { isBlocked: changedStatus } });
  const resData = {
    status: 'success',
    message: `Successfully ${changedStatus === true ? 'blocked' : 'unblocked'} ${user.firstName} ${
      user.lastName
    }`
  };
  sendResponse(200, resData, res);
});

//@desc   get all category data
//@route  GET /api/admin/getcategories
//@access private
const listCategories = asyncHandler(async (req, res) => {
  const agg = [
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'categoryId',
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
  const categories = await getDb().collection('categories').aggregate(agg).toArray();
  const resData = {
    status: 'success',
    data: categories
  };
  sendResponse(200, resData, res);
});

//@desc   add a new category
//@route  POST /api/admin/addcategory
//@access private
const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //checking if name and desciption exists
  if (!name || !description || !req.file) {
    throw new AppError('Please send all the required data', 400);
  }

  //checking if category name already exists
  const category = await getDb().collection('categories').findOne({ name });
  if (category) {
    throw new AppError('Category name already exists', 400);
  }
  //uploading image to cloudinary
  const result = await cloudinarySingleUpload(req, 'category');
  const bannerImg = {
    public_id: result.public_id,
    imgUrl: result.secure_url
  };
  await getDb().collection('categories').insertOne({ name, description, bannerImg });
  const resData = {
    status: 'success',
    message: 'Successfully added the category'
  };
  sendResponse(201, resData, res);
});

//@desc   edit an existing category
//@route  PUT /api/admin/editcategory/:id
//@access private
const editCategory = asyncHandler(async (req, res) => {
  const id = ObjectId(req.params.id);
  const categoryDetails = await getDb().collection('categories').findOne({ _id: id });

  //checking if id is valid
  if (!categoryDetails) {
    throw new AppError('Invalid category ID', 400);
  }
  let result;
  let bannerImg;

  //checking whether image file exists
  if (req.file) {
    //uploading image to cloudinary
    result = await cloudinarySingleUpload(req, 'category');
    bannerImg = {
      public_id: result.public_id,
      imgUrl: result.secure_url
    };
  }
  const data = {
    name: req.body.name || categoryDetails.name,
    description: req.body.description || categoryDetails.description,
    bannerImg: bannerImg || categoryDetails.bannerImg
  };

  //updating the data
  await getDb()
    .collection('categories')
    .updateOne({ _id: id }, { $set: { ...data } });
  const resData = {
    status: 'success',
    message: 'Successfully updated the category'
  };
  sendResponse(200, resData, res);
});

//@desc   delete an existing category
//@route  DELETE /api/admin/deletecategory/:id
//@access private
const deleteCategory = asyncHandler(async (req, res) => {
  const id = ObjectId(req.params.id);
  await getDb().collection('categories').deleteOne({ _id: id });
  await getDb().collection('products').deleteMany({ _id: id });
  const resData = {
    status: 'success',
    message: 'Successfully deleted the category'
  };
  sendResponse(200, resData, res);
});

//@desc   get all products data
//@route  GET /api/admin/getproducts
//@access private
const listProducts = asyncHandler(async (req, res) => {
  const products = await getDb().collection('products').find().toArray();
  const resData = {
    status: 'success',
    data: products
  };
  sendResponse(200, resData, res);
});

//@desc   add a new product
//@route  POST /api/admin/addproduct
//@access private
const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    discount = 0,
    categoryId,
    brandId,
    details,
    keyFeatures,
    description,
    stock = 1,
    rating = 3
  } = req.body;

  //checking if all values exist
  if (
    !name ||
    !price ||
    !categoryId ||
    !brandId ||
    !details ||
    !keyFeatures ||
    !description ||
    !stock
  ) {
    throw new AppError('Please enter all the fields', 400);
  }

  //checking if there is atleast 4 images
  if (req.files.length < 4) {
    throw new AppError('Upload atleast 4 images', 400);
  }
  /*uploading image to cloudinary which returns an array of promises
  so using Promise.all to await for all of it */
  const images = await Promise.all(
    req.files.map(async (file) => {
      req.file = file;
      const result = await cloudinarySingleUpload(req, 'products');
      return {
        public_id: result.public_id,
        imgUrl: result.secure_url
      };
    })
  );

  //inserting data to the database
  const dataToInsert = {
    name,
    price: Int32(price),
    discountedPrice: price - price * discount * 0.01,
    discount: Int32(discount),
    categoryId: ObjectId(categoryId),
    brandId: ObjectId(brandId),
    details,
    keyFeatures,
    description,
    stock: Int32(stock),
    rating: Int32(rating),
    images,
    createdOn: Timestamp(Date.now())
  };
  await getDb().collection('products').insertOne(dataToInsert);
  const resData = {
    status: 'success',
    message: 'Successfully added the product'
  };
  sendResponse(201, resData, res);
});

//@desc   edit an existing product
//@route  PUT /api/admin/editproduct/:id
//@access private
const editProduct = asyncHandler(async (req, res) => {
  const id = ObjectId(req.params.id);
  const product = await getDb().collection('products').findOne({ _id: id });
  if (!product) {
    throw new AppError('Invalid product ID', 400);
  }
  const {
    name = product.name,
    price = product.price,
    discount = product.discount,
    categoryId = product.categoryId,
    brandId = product.brandId,
    details = product.details,
    keyFeatures = product.keyFeatures,
    description = product.description,
    stock = product.stock,
    rating = product.rating
  } = req.body;

  /*uploading image to cloudinary which returns an array of promises
  so using Promise.all to await for all of it */
  const images = await Promise.all(
    req.files.map(async (file) => {
      req.file = file;
      const result = await cloudinarySingleUpload(req, 'products');
      return {
        public_id: result.public_id,
        imgUrl: result.secure_url
      };
    })
  );

  //concating old images with new images
  images.forEach((img, i) => {
    product.images[i] = img;
  });

  //updating data to the database
  const dataToInsert = {
    name,
    price: Int32(price),
    discountedPrice: price - price * discount * 0.01,
    discount: Int32(discount),
    categoryId: ObjectId(categoryId),
    brandId: ObjectId(brandId),
    details,
    keyFeatures,
    description,
    stock: Int32(stock),
    rating: Int32(rating),
    images: product.images,
    createdOn: Timestamp(Date.now())
  };
  await getDb()
    .collection('products')
    .updateOne({ _id: id }, { $set: { ...dataToInsert } });
  const resData = {
    status: 'success',
    message: 'Successfully updated the product'
  };
  sendResponse(201, resData, res);
});

//@desc   delete an existing product
//@route  DELETE /api/admin/deleteproduct/:id
//@access private
const deleteProduct = asyncHandler(async (req, res) => {
  const id = ObjectId(req.params.id);
  await getDb().collection('products').deleteOne({ _id: id });
  const resData = {
    status: 'success',
    message: 'Successfully deleted the product'
  };
  sendResponse(200, resData, res);
});

//@desc   get all brands data
//@route  GET /api/admin/getbrands
//@access private
const listBrands = asyncHandler(async (req, res) => {
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
  const resData = {
    status: 'success',
    data: brands
  };
  sendResponse(200, resData, res);
});

//@desc   add a new brand
//@route  POST /api/admin/addbrand
//@access private
const addBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //checking if name and desciption exists
  if (!name || !description || !req.file) {
    throw new AppError('Please send all the required data', 400);
  }

  //checking if category name already exists
  const category = await getDb().collection('brands').findOne({ name });
  if (category) {
    throw new AppError('Brand name already exists', 400);
  }
  //uploading image to cloudinary
  const result = await cloudinarySingleUpload(req, 'brand');
  const bannerImg = {
    public_id: result.public_id,
    imgUrl: result.secure_url
  };
  await getDb().collection('brands').insertOne({ name, description, bannerImg });
  const resData = {
    status: 'success',
    message: 'Successfully added the brand'
  };
  sendResponse(201, resData, res);
});

//@desc   edit an exiting brand
//@route  PUT /api/admin/editbrand/:id
//@access private
const editBrand = asyncHandler(async (req, res) => {
  const id = ObjectId(req.params.id);
  const categoryDetails = await getDb().collection('brands').findOne({ _id: id });

  //checking if id is valid
  if (!categoryDetails) {
    throw new AppError('Invalid brand ID', 400);
  }
  let result;
  let bannerImg;

  //checking whether image file exists
  if (req.file) {
    //uploading image to cloudinary
    result = await cloudinarySingleUpload(req, 'brand');
    bannerImg = {
      public_id: result.public_id,
      imgUrl: result.secure_url
    };
  }
  const data = {
    name: req.body.name || categoryDetails.name,
    description: req.body.description || categoryDetails.description,
    bannerImg: bannerImg || categoryDetails.bannerImg
  };

  //updating the data
  await getDb()
    .collection('brands')
    .updateOne({ _id: id }, { $set: { ...data } });
  const resData = {
    status: 'success',
    message: 'Successfully updated the brand'
  };
  sendResponse(200, resData, res);
});

//@desc   delete an exiting brand
//@route  GET /api/admin/deletebrand/:id
//@access private
const deleteBrand = asyncHandler(async (req, res) => {
  const id = ObjectId(req.params.id);
  await getDb().collection('brands').deleteOne({ _id: id });
  await getDb().collection('products').deleteMany({ _id: id });
  const resData = {
    status: 'success',
    message: 'Successfully deleted the brand'
  };
  sendResponse(200, resData, res);
});

export default {
  listUsers,
  editUser,
  changeUserStatus,
  listCategories,
  addCategory,
  editCategory,
  deleteCategory,
  listProducts,
  addProduct,
  editProduct,
  deleteProduct,
  listBrands,
  addBrand,
  editBrand,
  deleteBrand
};
