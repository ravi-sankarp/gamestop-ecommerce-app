import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

//User login route
router.post('/login', authController.userLogin);

//Admin login route
router.post('/adminlogin', authController.adminLogin);

//User request OTP for login
router.post('/requestotp', authController.requestOtp);

// User verify OTP login
router.post('/verifyotp', authController.verifyUserOtp);

//Register New User Route
router.post('/register', authController.registerUser);

//Generate new token with refresh Token
router.get('/refreshtoken', authController.handleRefreshToken);

export default router;
