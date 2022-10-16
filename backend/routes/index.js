import express from 'express';
import paymentController from '../controllers/paymentController.js';
import viewController from '../controllers/viewController.js';

const router = express.Router();

//Get all Products
router.get('/getallproducts', viewController.getAllProducts);

//Get single Product details
router.get('/getproduct/:id', viewController.getSingleProduct);

//Get single Category and Product List
router.get('/getnavlist', viewController.getBrandsAndCategoryList);

//verify razorpay webhook payment
router.post('/verifyrazorpaypayment', paymentController.verifyRazorpayPayment);

// Get Categories and Product
router.get('/getproductsandcategories', viewController.getProductsAndCategories);

// Get Categories and Product
router.get('/getallbanners', viewController.getAllBanners);

export default router;
