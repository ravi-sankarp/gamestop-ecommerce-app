import asyncHandler from 'express-async-handler';
import validator from 'validator';
import AppError from '../utils/appError.js';
import sendResponse from '../utils/sendResponse.js';
import * as userHelpers from '../helpers/userHelpers.js';
import * as productHelpers from '../helpers/productHelpers.js';
import * as categoryHelpers from '../helpers/categoryHelpers.js';
import * as brandHelpers from '../helpers/brandHelpers.js';
import * as bannerHelpers from '../helpers/bannerHelpers.js';
import * as adminHelpers from '../helpers/adminHelpers.js';
import cloudinarySingleUpload from '../utils/uploadToCloudinary.js';
import * as orderHelpers from '../helpers/orderHelpers.js';

//@desc   get all user data
//@route  GET /api/admin/getusers
//@access private
const listUsers = asyncHandler(async (req, res) => {
  const users = await adminHelpers.findAllUsers();
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
  const { id } = req.params;
  const userData = await userHelpers.findUserById(id);
  //checking if id was valid
  if (!userData) {
    throw new AppError('Cannot find user! Invalid ID', 400);
  }

  //getting data from request body
  const updatedData = {
    firstName: req.body.firstName || userData.firstName,
    lastName: req.body.lastName || userData.lastName,
    email: req.body.email?.toLowerCase().trim() || userData.email,
    phoneNumber: req.body.phoneNumber?.trim() || userData.phoneNumber
  };

  //checking if email is valid
  if (!validator.isEmail(updatedData.email)) {
    throw new AppError('Please enter a valid email address', 400);
  }
  if (!validator.isMobilePhone(updatedData.phoneNumber, 'en-IN')) {
    throw new AppError('Please enter a valid phone number', 400);
  }

  //checking if email already exists
  const userCheckEmail = await userHelpers.checkEmailAlreadyExists(id, updatedData.email);
  if (userCheckEmail) {
    throw new AppError('Email already exists', 409);
  }

  //checking if phone number already exists
  const userCheckPhoneNumber = await userHelpers.checkPhoneNumberAlreadyExists(
    id,
    updatedData.phoneNumber
  );
  if (userCheckPhoneNumber) {
    throw new AppError('Phone number already exists', 409);
  }
  await userHelpers.updateUserById(id, updatedData);
  const resData = {
    status: 'success',
    message: 'successfully updated user data'
  };
  sendResponse(200, resData, res);
});

//@desc   block/unblock a user
//@route  PUT /api/admin/changeuserstatus/:id
//@access private
const changeUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await userHelpers.findUserById(id);
  if (!user) {
    throw new AppError('User does not exist', 400);
  }
  const changedStatus = !user.isBlocked;
  await userHelpers.updateUserStatus(id, changedStatus);
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
  const categories = await categoryHelpers.findAllCategories();
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

  const category = await categoryHelpers.checkCategoryNameExists(null, name);
  if (category) {
    throw new AppError('Category name already exists', 400);
  }
  //uploading image to cloudinary
  const result = await cloudinarySingleUpload(req, 'category');
  const bannerImg = {
    public_id: result.public_id,
    imgUrl: result.secure_url
  };
  const modifiedName = name.trim();
  //adding data to database
  await categoryHelpers.createNewCategory({ name: modifiedName, description, bannerImg });
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
  const { id } = req.params;
  const categoryDetails = await categoryHelpers.findCategoryById(id);

  //checking if id is valid
  if (!categoryDetails) {
    throw new AppError('Invalid category ID', 400);
  }
  let result;
  let bannerImg;

  //checking if category name already exists
  if (req.body.name) {
    const category = await categoryHelpers.checkCategoryNameExists(id, req.body.name);
    if (category) {
      throw new AppError('Category name already exists', 400);
    }
  }

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
    name: req.body.name.trim() || categoryDetails.name,
    description: req.body.description || categoryDetails.description,
    bannerImg: bannerImg || categoryDetails.bannerImg
  };

  //updating the data
  await categoryHelpers.updateCategoryById(id, data);
  const resData = {
    status: 'success',
    message: 'Successfully updated the category'
  };
  sendResponse(200, resData, res);
});

//@desc   delete an existing category and products belonging to that category
//@route  DELETE /api/admin/deletecategory/:id
//@access private
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await categoryHelpers.deleteCategoryById(id);
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
  const categories = await categoryHelpers.findAllCategories();
  const brands = await brandHelpers.findAllBrands();
  const products = await productHelpers.findAllProducts();

  const resData = {
    status: 'success',
    data: { products, brands, categories }
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
    price: price,
    discountedPrice: Math.ceil(price - price * discount * 0.01),
    discount: discount,
    categoryId: categoryId,
    brandId: brandId,
    details,
    keyFeatures,
    description,
    stock: stock,
    rating: rating,
    images
  };

  await productHelpers.createNewProduct(dataToInsert);
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
  const { id } = req.params;
  const product = await productHelpers.findProductById(id);
  if (!product) {
    throw new AppError('Invalid product ID', 400);
  }
  const {
    name = product.name,
    price = product.price,
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
  let images = [];
  if (req.files.length) {
    images = await Promise.all(
      req.files.map(async (file) => {
        req.file = file;
        const result = await cloudinarySingleUpload(req, 'products');
        return {
          public_id: result.public_id,
          imgUrl: result.secure_url
        };
      })
    );
  }

  //concating old images with new images
  images?.forEach((img, i) => {
    product.images[i] = img;
  });
  //updating data to the database
  const dataToInsert = {
    name,
    price: price,
    categoryId: categoryId,
    brandId: brandId,
    details,
    keyFeatures,
    description,
    stock: stock,
    rating: rating,
    images: product.images
  };
  await productHelpers.updateProductById(id, dataToInsert);
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
  const { id } = req.params;
  await productHelpers.deleteProductById(id);
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
  const brands = await brandHelpers.findAllBrands();
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

  const modifiedName = name.trim();
  //checking if brand name already exists
  const brand = await brandHelpers.checkBrandNameExists(null, modifiedName);
  if (brand) {
    throw new AppError('Brand name already exists', 400);
  }
  //uploading image to cloudinary
  const result = await cloudinarySingleUpload(req, 'brand');
  const bannerImg = {
    public_id: result.public_id,
    imgUrl: result.secure_url
  };
  await brandHelpers.createNewBrand({ name: modifiedName, description, bannerImg });
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
  const { id } = req.params;
  const brandDetails = await brandHelpers.finBrandByID(id);

  //checking if id is valid
  if (!brandDetails) {
    throw new AppError('Invalid brand ID', 400);
  }
  let result;
  let bannerImg;

  //checking whether brand name exists
  if (req.body.name) {
    const brand = await brandHelpers.checkBrandNameExists(id, req.body.name);
    if (brand) {
      throw new AppError('Brand Name already exists', 400);
    }
  }
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
    name: req.body.name.trim() || brandDetails.name,
    description: req.body.description || brandDetails.description,
    bannerImg: bannerImg || brandDetails.bannerImg
  };

  //updating the data
  await brandHelpers.updateBrandById(id, data);
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
  const { id } = req.params;
  await brandHelpers.deleteBrandById(id);
  const resData = {
    status: 'success',
    message: 'Successfully deleted the brand'
  };
  sendResponse(200, resData, res);
});

//@desc   get all banner data
//@route  GET /api/admin/getbanner
//@access private
const listBanners = asyncHandler(async (req, res) => {
  const banners = await bannerHelpers.findAllBanners();
  const resData = {
    status: 'success',
    data: banners
  };
  sendResponse(200, resData, res);
});

//@desc   add a new banner
//@route  POST /api/admin/addbanner
//@access private
const addBanner = asyncHandler(async (req, res) => {
  const { title, description, type, typeId } = req.body;
  //checking if title and desciption exists
  if (!title || !description || !req.file || !type || !typeId) {
    throw new AppError('Please send all the required data', 400);
  }

  //uploading image to cloudinary
  const result = await cloudinarySingleUpload(req, 'banner');
  const bannerImg = {
    public_id: result.public_id,
    imgUrl: result.secure_url
  };

  //adding data to database
  await bannerHelpers.createNewBanner({ title, description, type, id: typeId, bannerImg });
  const resData = {
    status: 'success',
    message: 'Successfully added the banner'
  };
  sendResponse(201, resData, res);
});

//@desc   edit an exiting banner
//@route  PUT /api/admin/editbanner/:id
//@access private
const editBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bannerDetails = await bannerHelpers.findBannerById(id);

  //checking if id is valid
  if (!bannerDetails) {
    throw new AppError('Invalid banner ID', 400);
  }
  let result;
  let bannerImg;

  //checking whether image file exists and uploading to cloudinary
  if (req.file) {
    result = await cloudinarySingleUpload(req, 'brand');
    bannerImg = {
      public_id: result.public_id,
      imgUrl: result.secure_url
    };
  }

  //setting banner type if it exists
  let typeName;
  if (req.body.type) {
    typeName = req.body.type.toLowerCase();
  }

  const data = {
    title: req.body.title || bannerDetails.title,
    description: req.body.description || bannerDetails.description,
    type: typeName || bannerDetails.type,
    id: req.body.typeId || bannerDetails.id,
    bannerImg: bannerImg || bannerDetails.bannerImg
  };

  //updating the data
  await bannerHelpers.updateBannerById(id, data);
  const resData = {
    status: 'success',
    message: 'Successfully updated the banner'
  };
  sendResponse(200, resData, res);
});

//@desc   delete an exiting banner
//@route  GET /api/admin/deletebanner/:id
//@access private
const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await bannerHelpers.deleteBannerById(id);
  const resData = {
    status: 'success',
    message: 'Successfully deleted the banner'
  };
  sendResponse(200, resData, res);
});

//@desc   List all Orders
//@route  GET /api/getallorders
//@access private
const listAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderHelpers.findAllOrders();
  const resData = {
    status: 'success',
    data: orders
  };
  sendResponse(200, resData, res);
});

//@desc   Update order status
//@route  PATCH /api/updateorderstatus
//@access private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  //check if status exists
  if (!status || !orderId) {
    throw new AppError('Please send all the necessary data', 400);
  }

  // find the corresponding order details
  const { order } = await orderHelpers.findOrderByOrderId(orderId);

  // checking if order id was invalid
  if (!order) {
    throw new AppError('No orders found ', 400);
  }

  //if order already cancelled or delivered throw an error
  if (
    order.orderStatus.includes('Cancelled') ||
    order.orderStatus === 'Delivered' ||
    order.orderStatus === 'Returned'
  ) {
    throw new AppError(`Cannot change order status ! Order already ${order.orderStatus} `);
  }

  //check if status is valid
  if (
    status !== 'Order Dispatched' &&
    status !== 'Order Shipped' &&
    status !== 'Out For Delivery' &&
    status !== 'Cancelled By Admin' &&
    status !== 'Delivered'
  ) {
    throw new AppError('Status is not valid', 400);
  }

  //update status
  await orderHelpers.changeOrderStatus(orderId, status);

  if (status === 'Cancelled By Admin') {
    if (order.items) {
      // if order contain more than 1 item then update the stock of all product if the items was cancelled
      await Promise.all(
        order.items.map(
          async (item) => await productHelpers.updateProductStock(item.productId, item.count)
        )
      );
    } else {
      // update product stock if the item contains only 1 product
      await productHelpers.updateProductStock(order.item.productId, order.item.count);
    }
  }
  const resData = {
    status: 'success',
    message: `Changed order status to ${status}`
  };
  sendResponse(200, resData, res);
});

//@desc   Get Card data for admin dashboard
//@route  GET /api/getdashboardcarddata
//@access private
const getDashboardCardData = asyncHandler(async (req, res) => {
  const result = await Promise.all([
    userHelpers.findTotalUsers(),
    productHelpers.findTotalProducts(),
    orderHelpers.findTotalOrderAmount(),
    orderHelpers.findTotalOrders()
  ]);
  const modified = result.reduce((acc, ele) => ({ ...acc, ...ele }), {});
  const resData = {
    status: 'success',
    data: modified
  };
  sendResponse(200, resData, res);
});

//@desc   Get graph data for admin dashboard
//@route  GET /api/getdashboardgraphdata
//@access private
const getDashboardGraphData = asyncHandler(async (req, res) => {
  const result = await Promise.all([
    orderHelpers.countOrdersWithSamePaymentMethod(),
    orderHelpers.getLastWeekOrders()
  ]);
  const resData = {
    status: 'success',
    data: result
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
  deleteBrand,
  listBanners,
  addBanner,
  editBanner,
  deleteBanner,
  listAllOrders,
  updateOrderStatus,
  getDashboardCardData,
  getDashboardGraphData
};
