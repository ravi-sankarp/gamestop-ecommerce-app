import { Router } from 'express';
import authController from '../controllers/authController.js';
import loginLimitter from '../middlewares/customRateLimiter.js';

const router = Router();

//User login route
router.post('/login', loginLimitter, authController.userLogin);

//Admin login route
router.post('/adminlogin', loginLimitter, authController.adminLogin);

//Login with google
router.post('/googlelogin', authController.googleLogin);

//User request OTP for login
router.post('/requestotp', loginLimitter, authController.requestOtp);

// User verify OTP login
router.post('/verifyotp', loginLimitter, authController.verifyUserOtp);

//Register New User Route
router.post('/register', authController.registerUser);

//Generate new token with refresh Token
router.get('/refreshtoken', authController.handleRefreshToken);

//Generate otp for resetting password
router.post('/forgotpassword', authController.handleForgotPassword);

//Change password after verification
router.post('/changepassword', authController.handleChangePassword);

export default router;
