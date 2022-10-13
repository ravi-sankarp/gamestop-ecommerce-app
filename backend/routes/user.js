import { Router } from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

//Route for updating contents in user cart
router.put('/updatecart', protect, userController.updateCart);

//Route for updating contents in user cart
router.delete('/removefromcart/:id', protect, userController.removeProductFromCart);

//route for listing all item in cart
router.get('/getcartdetails', protect, userController.listCartDetails);

//route for moving an item from cart to wishlist
router.put('/movetowishlist/:id', protect, userController.moveToWishlist);

//route for getting cart total
router.get('/getcarttotal', protect, userController.getCartTotal);

//Route for updating contents in user wishlist
router.put('/updatewishlist', protect, userController.updateWishlist);

//Route for updating contents in user cart
router.delete('/removefromwishlist/:id', protect, userController.removeProductFromWishlist);

//route for listing all item in cart
router.get('/getwishlistdetails', protect, userController.listWishlistDetails);

//route for moving an item from wishlist to cart
router.put('/movetocart/:id', protect, userController.moveToCart);

//route for getting the cart count
router.get('/getcartandwishlistcount', protect, userController.getCartAndWishlistCount);

//route for getting user details
router.get('/getuserdetails', protect, userController.getUserDetails);

//route for editing user details
router.put('/edituserdetails', protect, userController.editUserDetails);

//route for editing an existing address
router.put('/changeuserpassword', protect, userController.changeUserPassword);

//route for getting all addresses of the user
router.get('/getaddresses', protect, userController.getAllAddresses);

//route for adding a new address for the user
router.put('/addaddress', protect, userController.addNewAddress);

//route for editing an existing address
router.put('/editaddress/:id', protect, userController.editAddress);

//route for deleting an address
router.delete('/deleteaddress/:id', protect, userController.deleteAddress);

//route for checking if a coupon is valid
router.post('/checkcoupon', protect, userController.checkCoupon);

//route for placing an order with cash on delivery
router.post('/purchasewithcod', protect, userController.purchaseWithCod);

//route for creating order details for razorpay
router.post('/createrazorpayorder', protect, userController.createRazorpayOder);

//route for checking if payment has been completed
router.get('/checkpaymentstatus/:id', protect, userController.checkPaymentStatus);

//route for creating order details for razorpay
router.post('/createpaypalorder', protect, userController.createPaypalOrder);

//route for verifying paypal payment
router.post('/verifypaypal', protect, userController.verifyPaypal);

// route for listing wallet details of the user
router.get('/getwalletdetails', protect, userController.addNewAddress);

//route for listing all orders of user
router.get('/getallorders', protect, userController.listUserOrders);

//route for cancelling an order
router.patch('/cancelorder', protect, userController.cancelOrder);

//route for returning a delivered product
router.patch('/returnproduct', protect, userController.returnOrder);

// route for getting invoice of a delivered product
router.get('/getinvoice/:id', protect, userController.generateInvoice);

export default router;
