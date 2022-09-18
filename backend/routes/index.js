import express from 'express';
import userAuth from '../contollers/userAuthController.js';
import userController from '../contollers/userController.js';

const router = express.Router();

//User login route
router.post('/login', userAuth.userLogin);

//User request OTP for login
router.post('/requestotp', userAuth.requestOtp);


// User verify OTP login
router.post('/verifyotp', userAuth.verifyUserOtp);


//Register New User Route
router.post('/register', userAuth.registerUser);

//Get all Products
router.get('/getproducts', userController.getAllProducts);

//Get single Product details
router.get('/getproduct/:id', userController.getSingleProduct);


export default router;
