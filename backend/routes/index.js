import express from 'express';
import userAuth from '../contollers/userAuthController.js';

const router = express.Router();

//User login route
router.post('/login', userAuth.userLogin);

//Register New User Route
router.post('/register', userAuth.registerUser);

export default router;
