import express from 'express';
import paymentController from '../controllers/paymentController.js';
import viewController from '../controllers/viewController.js';

const router = express.Router();

//Get all Products
router.get('/getallproducts', viewController.getAllProducts);

//Get single Product details
router.get('/getproduct/:id', viewController.getSingleProduct);

// Get brand data for a particular brand
router.get('/getbrand/:id', viewController.getBrandData);

// Get the category data for a particular category
router.get('/getcategory/:id', viewController.getCategoryData);

//Get single Category and Product List
router.get('/getnavlist', viewController.getBrandsAndCategoryList);

//verify razorpay webhook payment
router.post('/verifyrazorpaypayment', paymentController.verifyRazorpayPayment);

// Get Categories and Product
router.get('/getproductsandcategories', viewController.getProductsAndCategories);

// Get Categories and Product
router.get('/getallbanners', viewController.getAllBanners);

// Search for a product
router.get('/searchproduct', viewController.handleSearch);

// Get similar products
router.get('/findsimilarproducts', viewController.getSimilarProducts);

// Get product reviews
router.get('/getproductreviews', viewController.getProductReviews);

export default router;
