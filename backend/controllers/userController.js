import asyncHandler from 'express-async-handler';
import { rm } from 'fs/promises';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import AppError from '../utils/appError.js';
import sendResponse from '../utils/sendResponse.js';
import * as cartHelpers from '../helpers/cartHelpers.js';
import * as wishlistHelpers from '../helpers/wishlistHelpers.js';
import * as paymentHelpers from '../helpers/paymentHelpers.js';
import { findProductById, updateProductStock } from '../helpers/productHelpers.js';
import {
  checkEmailAlreadyExists,
  checkPhoneNumberAlreadyExists,
  deleteAddressById,
  findUserById,
  insertNewAddress,
  updateAddress,
  updateUserById
} from '../helpers/userHelpers.js';
import {
  cancelIndividualOrder,
  cancelOrderById,
  changeOrderStatus,
  findOrderByOrderId,
  findOrdersByUserId,
  returnIndividualOrder,
  returnOrderById,
  updateOrderTotal
} from '../helpers/orderHelpers.js';
import createOrder from '../helpers/createNewOrder.js';
import generatePdf from '../utils/generatePdf.js';
import { hashPassword } from './authController.js';
import { generateRefreshToken, generateToken } from '../utils/jwtHelper.js';
import { paypal, razorpayInstance } from '../config/payment.js';
import { findByCouponCode } from '../helpers/couponHelpers.js';

//@desc   Add items to cart or increase/decrease product quantity
//@route  GET /api/user/updatecart
//@access private
const updateCart = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { productId, count: stringCount } = req.body;

  const count = Number(stringCount);

  //check if data exists
  if (!productId || !count) {
    throw new AppError('Please send all the necessary values', 400);
  }

  //check if update count is either 1 or -1
  if (count !== 1 && count !== -1) {
    throw new AppError('Product update count value must be either 1 or -1', 400);
  }

  //checking if product Id is valid
  const product = await findProductById(productId);
  if (!product) {
    throw new AppError('Invalid Product Id!', 400);
  }

  //check  product already exists in cart
  const cart = await cartHelpers.checkProductExists(user._id, productId);

  //if product exists then update cart
  if (cart) {
    // Throwing error if product count is already one and the request is to decrement the count further
    const productCount = cart.items.find((item) => item.productId.toString() === productId).count;

    if (count === -1 && productCount === 1) {
      throw new AppError('Product count is already 1.Could not decrease further ', 400);
    }
    //update product in cart
    await cartHelpers.updateProductCount(user._id, productId, count);
    const resData = {
      status: 'Success',
      message: `Successfully changed '${product.name}' QUANTITY to ${
        productCount + count
      } in your cart`
    };
    sendResponse(200, resData, res);
  } else {
    //if product does not exists in cart then add product to cart
    await cartHelpers.addToCart(user._id, productId);
    const resData = {
      status: 'Success',
      message: `Successfully added ${product.name} to your cart`
    };
    sendResponse(200, resData, res);
  }
});

//@desc   Remove a product from cart
//@route  DELETE /api/removefromcart/:id
//@access private
const removeProductFromCart = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { id } = req.params;

  //checking if product Id is valid
  const product = await findProductById(id);
  if (!product) {
    throw new AppError('Invalid Product Id!', 400);
  }

  //delete product from cart
  await cartHelpers.removeFromCart(user._id, id);

  const resData = {
    status: 'Success',
    message: `Successfully removed the ${product.name} from your cart`
  };
  sendResponse(200, resData, res);
});

//@desc   Move a product from cart to wishlist
//@route  PUT /api/movetowishlist/:id
//@access private
const moveToWishlist = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { id } = req.params;

  //checking if product Id is valid
  const product = await findProductById(id);
  if (!product) {
    throw new AppError('Invalid Product Id!', 400);
  }
  //check  product already exists in wishlist
  const wishlist = await wishlistHelpers.checkProductExistsInWishlist(user._id, id);

  let resData;
  //if product exists then notify the user
  if (wishlist) {
    resData = {
      status: 'Success',
      message: `'${product.name}' is already in your wishlist`
    };
  } else {
    //if product does not exists in wishlist then add product to wishlist
    await wishlistHelpers.addToWishlist(user._id, id);
    resData = {
      status: 'Success',
      message: `Successfully added ${product.name} to your wishlist`
    };
  }
  //delete product from cart
  await cartHelpers.removeFromCart(user._id, id);
  sendResponse(201, resData, res);
});

//@desc   Get cart details of a user
//@route  GET /api/getcartdetails
//@access private
const listCartDetails = asyncHandler(async (req, res) => {
  const user = req.userDetails;

  const cart = await cartHelpers.findCartByUserId(user._id);
  if (!cart.length) {
    const resData = {
      status: 'Success',
      message: 'Your cart is empty'
    };
    sendResponse(200, resData, res);
  } else {
    const resData = {
      status: 'Success',
      data: { ...cart[0] }
    };
    sendResponse(200, resData, res);
  }
});

//@desc   Add items to wishlist
//@route  GET /api/user/updatewishlist
//@access private
const updateWishlist = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { productId } = req.body;

  //check if data exists
  if (!productId) {
    throw new AppError('Please send all the necessary values', 400);
  }

  //checking if product Id is valid
  const product = await findProductById(productId);
  if (!product) {
    throw new AppError('Invalid Product Id!', 400);
  }

  //check  product already exists in wishlist
  const wishlist = await wishlistHelpers.checkProductExistsInWishlist(user._id, productId);

  //if product exists then notify the user
  if (wishlist) {
    const resData = {
      status: 'Success',
      message: `'${product.name}' is already in your wishlist`
    };
    sendResponse(200, resData, res);
  } else {
    //if product does not exists in wishlist then add product to wishlist
    await wishlistHelpers.addToWishlist(user._id, productId);
    const resData = {
      status: 'Success',
      message: `Successfully added ${product.name} to your wishlist`
    };
    sendResponse(201, resData, res);
  }
});

//@desc   Remove a product from wishlist
//@route  DELETE /api/removefromwishlist/:id
//@access private
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { id } = req.params;

  //checking if product Id is valid
  const product = await findProductById(id);
  if (!product) {
    throw new AppError('Invalid Product Id!', 400);
  }

  //delete product from cart
  await wishlistHelpers.removeFromWishlist(user._id, id);

  const resData = {
    status: 'Success',
    message: `Successfully removed the ${product.name} from your wishlist`
  };
  sendResponse(200, resData, res);
});

//@desc   Move a product from wishlist to cart
//@route  PUT /api/movetocart/:id
//@access private
const moveToCart = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { id: productId } = req.params;

  //checking if product Id is valid
  const product = await findProductById(productId);
  if (!product) {
    throw new AppError('Invalid Product Id!', 400);
  }
  //check  product already exists in cart
  const cart = await cartHelpers.checkProductExists(user._id, productId);

  let resData;
  //if product exists then update cart
  if (cart) {
    //update product in cart
    await cartHelpers.updateProductCount(user._id, productId, 1);
    resData = {
      status: 'Success',
      message: `Moved '${product.name}' from your wishlist to your cart`
    };
  } else {
    //if product does not exists in cart then add product to cart
    await cartHelpers.addToCart(user._id, productId);
    resData = {
      status: 'Success',
      message: `Successfully moved  ${product.name} from your wishlist to your cart`
    };
  }
  await wishlistHelpers.removeFromWishlist(user._id, productId);
  sendResponse(200, resData, res);
});

//@desc   Get wishlist details of the user
//@route  GET /api/getwishlistdetails
//@access private
const listWishlistDetails = asyncHandler(async (req, res) => {
  const user = req.userDetails;

  const wihslist = await wishlistHelpers.findWishlistByUserId(user._id);
  if (!wihslist.length) {
    const resData = {
      status: 'Success',
      message: 'Your wishlist is empty'
    };
    sendResponse(200, resData, res);
  } else {
    const resData = {
      status: 'Success',
      data: { ...wihslist[0] }
    };
    sendResponse(200, resData, res);
  }
});

//@desc   Find the number of items in the cart and wishlist
//@route  GET /api/getcartcount
//@access private
const getCartAndWishlistCount = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const result = await Promise.all([
    cartHelpers.findCartCount(user._id),
    wishlistHelpers.findWishlistCountByUserId(user._id)
  ]);
  let resData;
  if (result) {
    resData = {
      status: 'success',
      data: { ...result }
    };
  } else {
    resData = {
      status: 'success',
      data: { ...result }
    };
  }
  sendResponse(200, resData, res);
});

//@desc   Get total Price in cart
//@route  GET /api/getcartotal
//@access private
const getCartTotal = asyncHandler(async (req, res) => {
  const { _id } = req.userDetails;
  const result = await cartHelpers.findCartTotalByUserId(_id);
  let resData;
  if (result) {
    resData = {
      status: 'success',
      data: { ...result }
    };
  } else {
    throw new AppError('Your cart is empty ! Add some items to cart to checkout.', 400);
  }
  sendResponse(200, resData, res);
});

//@desc   Get details of the user
//@route  GET /api/getuserdetails
//@access private
const getUserDetails = asyncHandler(async (req, res) => {
  const details = req.userDetails;

  const resData = {
    status: 'success',
    data: details
  };

  sendResponse(200, resData, res);
});

//@desc   Edit user details
//@route  PUT /api/edituserdetails/
//@access private
const editUserDetails = asyncHandler(async (req, res) => {
  const { _id: id } = req.userDetails;
  const userData = req.userDetails;

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
  const userCheckEmail = await checkEmailAlreadyExists(id, updatedData.email);
  if (userCheckEmail) {
    throw new AppError('Email already exists', 409);
  }

  //checking if phone number already exists
  const userCheckPhoneNumber = await checkPhoneNumberAlreadyExists(id, updatedData.phoneNumber);
  if (userCheckPhoneNumber) {
    throw new AppError('Phone number already exists', 409);
  }
  await updateUserById(id, updatedData);
  const resData = {
    status: 'success',
    message: 'Successfully updated user data'
  };
  sendResponse(200, resData, res);
});

//@desc   Change password of the user
//@route  PUT /api/changeuserpassword/
//@access private
const changeUserPassword = asyncHandler(async (req, res) => {
  const { _id: id } = req.userDetails;
  const { confirmPassword, newPassword, confirmNewPassword } = req.body;
  if ((!confirmPassword, !newPassword, !confirmNewPassword)) {
    throw new AppError('Please send all the required data !', 400);
  }

  //get user data
  const userData = await findUserById(id);

  //check if both confirm password and password match
  const isCorrectPassword = await bcrypt.compare(confirmPassword, userData.password);
  if (isCorrectPassword) {
    //check if new password and confirm passwords are the same
    if (newPassword === confirmNewPassword) {
      // hashing new password
      const hashedPwd = await hashPassword(newPassword);
      const updatedData = {
        password: hashedPwd,
        passwordChangedAt: new Date()
      };
      await updateUserById(id, updatedData);
    } else {
      throw new AppError('New password and confirm new password does not match', 400);
    }
  } else {
    throw new AppError('Incorrect password ! ', 400);
  }
  const resData = {
    status: 'success',
    message: 'Successfully updated user password',
    token: generateToken(id),
    refreshToken: generateRefreshToken(id),
    admin: req.userDetails.isAdmin
  };
  sendResponse(200, resData, res);
});

//@desc   Find all addresses of the user
//@route  GET /api/getaddresses
//@access private
const getAllAddresses = asyncHandler(async (req, res) => {
  const { addresses } = req.userDetails;
  let resData;
  if (addresses) {
    resData = {
      status: 'success',
      data: addresses
    };
  } else {
    resData = {
      status: 'success',
      message: 'You have not added any address!'
    };
  }
  sendResponse(200, resData, res);
});

//@desc   Add new address by the user
//@route  POST /api/addadress
//@access private
const addNewAddress = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { name, phoneNumber, houseName, streetName, city, district, state, pincode } = req.body;

  //checking if data exists
  if (
    !name ||
    !phoneNumber ||
    !houseName ||
    !streetName ||
    !city ||
    !district ||
    !state ||
    !pincode
  ) {
    throw new AppError('Please send all the required data', 400);
  }

  //inserting new address
  await insertNewAddress(user._id, {
    name,
    houseName,
    streetName,
    city,
    district,
    state,
    pincode,
    phoneNumber
  });
  const resData = {
    status: 'success',
    message: 'Successfully added new address'
  };
  sendResponse(201, resData, res);
});

//@desc   Edit an existing user address
//@route  PUT /api/editaddress/:id
//@access private
const editAddress = asyncHandler(async (req, res) => {
  const { _id, addresses } = req.userDetails;
  const addressId = req.params.id;

  //finding address data
  const addressData = addresses.find((address) => address.id.toString() === addressId);
  const { name, houseName, phoneNumber, streetName, city, district, state, pincode } = req.body;
  const updatedData = {
    name: name || addressData.name,
    phoneNumber: phoneNumber || addressData.phoneNumber,
    houseName: houseName || addressData.houseName,
    streetName: streetName || addressData.streetName,
    city: city || addressData.city,
    district: district || addressData.district,
    state: state || addressData.state,
    pincode: pincode || addressData.pincode
  };

  //updating the data
  await updateAddress(_id, addressId, updatedData);
  const resData = {
    status: 'success',
    message: 'Successfully updated the address '
  };
  sendResponse(200, resData, res);
});

//@desc   delete an existing address
//@route  DELETE /api/deleteaddress/:id
//@access private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const addressId = req.params.id;
  await deleteAddressById(user._id, addressId);
  const resData = {
    status: 'success',
    message: 'Successfully deleted the address '
  };
  sendResponse(200, resData, res);
});

//@desc   Check if a coupon is valid
//@route  POST /api/checkcoupon
//@access private
const checkCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const { userDetails: user } = req;
  console.log(user);
  // check if code exists
  if (!code) {
    throw new AppError('Please provide a coupon code', 400);
  }

  // get corresponding coupon details
  const couponDetails = await findByCouponCode(code);

  // check if coupon code is valid
  if (!couponDetails) {
    throw new AppError('Invalid Coupon Code', 400);
  }

  //check if coupon code has expired
  if (couponDetails.expiryDate <= new Date()) {
    throw new AppError('Coupon has expired', 400);
  }

  //check if user has already applied the coupon
  const found = couponDetails?.users?.find((userId) => userId.toString() === user._id.toString());
  if (found) {
    throw new AppError('You have already applied the coupon!', 400);
  }

  // Finding the cart of the user to verify that minimum purchase limit is satisfied
  const [cart] = await cartHelpers.findCartByUserId(user._id);

  //checking if cart is empty
  if (!cart) {
    throw new AppError('Your cart is empty ! Add items to cart to add a coupon', 400);
  }
  // check if the minimum purchase limit of the coupon is satisfied
  if (couponDetails.minPrice > cart.discountedTotal) {
    throw new AppError(
      `Minimum purchase for this coupon is ${couponDetails.minPrice.toLocaleString(
        'en-IN'
      )} rupees`,
      400
    );
  }
  const resData = {
    status: 'success',
    message: 'Successfully applied coupon ',
    data: {
      discount: couponDetails.discount
    }
  };
  sendResponse(200, resData, res);
});

//@desc   purchase an item with cash on deliver
//@route  POST /api/purchasewithcode
//@access private
const purchaseWithCod = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { addressId, couponCode } = req.body;

  //creating order
  await createOrder(user, addressId, couponCode);

  //empty cart after placing the order
  await cartHelpers.deleteCartByUserId(user._id);

  //sending success response
  const resData = {
    status: 'success',
    message: 'Successfully placed the order'
  };
  sendResponse(200, resData, res);
});

//@desc   create razorpay order details
//@route  POST /api/createrazorpayorder
//@access private
const createRazorpayOder = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { addressId, couponCode } = req.body;
  //creating order
  const orderId = await createOrder(user, addressId, couponCode, 'Order Pending', 'Razorpay');

  // getting cart details
  const [cart] = await cartHelpers.findCartByUserId(user._id);

  const options = {
    amount: cart.discountedTotal * 100,
    currency: 'INR',
    receipt: orderId
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);
  if (!razorpayOrder) {
    throw new AppError('Some error occured', 500);
  }

  //update the returned razorpay order id to the payment document
  await paymentHelpers.createNewPayment(
    user._id,
    orderId,
    'Razorpay',
    razorpayOrder.id,
    cart.discountedTotal
  );

  //send the order details as response
  const resData = {
    status: 'Success',
    data: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: 'INR',
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phoneNumber
      }
    }
  };
  sendResponse(200, resData, res);
});

//@desc   create payapl order details
//@route  POST /api/user/createpaypalorder
//@access private
const createPaypalOrder = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const { addressId, couponCode } = req.body;
  // creating order
  const orderId = await createOrder(user, addressId, couponCode, 'Order Pending', 'Paypal');

  // getting cart details
  const [cart] = await cartHelpers.findCartByUserId(user._id);
  const paymentJson = {
    intent: 'SALE',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: 'http://localhost:3000/checkout',
      cancel_url: 'http://localhost:3000/checkout'
    },
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: Math.ceil(cart.discountedTotal / 80)
        },
        description: 'Gamestop checkout'
      }
    ]
  };

  // creating a paypal order
  paypal.payment.create(
    paymentJson,
    asyncHandler(async (err, payment) => {
      if (err) {
        res.status(500).json(err);
      } else {
        const { length } = payment.links;

        //update the returned paypal order id to the payment document
        await paymentHelpers.createNewPayment(
          user._id,
          orderId,
          'Paypal',
          payment.id,
          cart.discountedTotal
        );

        for (let i = 0; i < length; i += 1) {
          if (payment.links[i].rel === 'approval_url') {
            //getting the redirect url for the paypal order
            const redirectUrl = payment.links[i].href;

            //sending the redirect url as response
            const resData = {
              status: 'Success',
              data: redirectUrl
            };
            sendResponse(200, resData, res);
          }
        }
      }
    })
  );
});

//@desc   Verify paypal payment
//@route  GET /api/verifypaypalpayment
//@access private
const verifyPaypal = asyncHandler(async (req, res) => {
  const { paymentId, payerId } = req.body;

  // rejecting if payment id or payerid is not present
  if (!paymentId || !payerId) {
    throw new AppError('Could not verify Payment!', 400);
  }
  const { amount } = await paymentHelpers.findByPaymentId(paymentId);
  const executePaymentJson = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: amount
        }
      }
    ]
  };
  paypal.payment.execute(
    paymentId,
    executePaymentJson,
    asyncHandler(async (error, payment) => {
      if (error) {
        console.log(error.response);
        res.status(400).json({
          ...error.response
        });
      } else if (payment.state === 'approved') {
        const updateData = {
          status: 'success',
          method: payment?.transactions[0]?.related_resources[0]?.sale?.payment_mode
        };

        // updating the payment data to the database
        const result = await paymentHelpers.updatePaymentDetails(paymentId, updateData);

        // changing the order status to order placed
        await changeOrderStatus(result?.orderId, 'Order Placed');

        //empty cart after placing the order
        await cartHelpers.deleteCartByUserId(result.userId);

        res.json({
          status: 'success'
        });
      } else {
        throw new AppError('Payment Failed!', 400);
      }
    })
  );
});

//@desc   Verify that the payment was successfull
//@route  GET /api/checkpaymentstatus
//@access private
const checkPaymentStatus = asyncHandler(async (req, res) => {
  const paymentId = req.params.id;
  const result = await paymentHelpers.findByPaymentId(paymentId);
  if (result?.status === 'success') {
    res.json({
      status: 'success',
      message: 'Order Placed'
    });
  } else {
    res.json({
      status: 'failed',
      message: 'order failed'
    });
  }
});

//@desc   List all orders
//@route  GET /api/getallorders
//@access private
const listUserOrders = asyncHandler(async (req, res) => {
  const user = req.userDetails;
  const orders = await findOrdersByUserId(user._id);
  let resData;
  if (orders) {
    resData = {
      status: 'success',
      data: orders.orders
    };
  } else {
    resData = {
      status: 'success',
      message: 'You have not ordered anything till now!'
    };
  }
  sendResponse(200, resData, res);
});

//@desc   Cancel an order
//@route  PATCH /api/cancelorder
//@access private
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId, productId } = req.body;

  //check if all the data is present
  if (!orderId || !productId) {
    throw new AppError('Please send all the data', 400);
  }

  // find the corresponding order details
  const { order } = await findOrderByOrderId(orderId);

  // checking if order id was invalid
  if (!order) {
    throw new AppError('No orders found ', 400);
  }

  // check whether order has been delivered
  if (
    order.orderStatus === 'Delivered' ||
    order.orderStatus === 'Returned' ||
    order.orderStatus.includes('Canceled')
  ) {
    throw new AppError(`Order has already been ${order.orderStatus} !`, 400);
  }

  // checking if the order has multiple products
  if (order?.items) {
    // find the corresponding item details
    const orderedItemDetails = order.items.find((item) => item.productId.toString() === productId);

    // check if the individual product has been returned
    if (orderedItemDetails.returned) {
      throw new AppError('Order has already been returned', 400);
    }

    //change the order status of the product to cancelled
    await cancelIndividualOrder(orderId, productId, orderedItemDetails.subTotalDiscounted);

    // recalculate the total price of the order
    const updatedTotal = order.totalAmountDiscounted - orderedItemDetails.subTotalDiscounted;

    //change the product stock after cancelling the order,update the total order price
    await Promise.all([
      updateProductStock(orderedItemDetails.productId, orderedItemDetails.count),
      updateOrderTotal(orderId, updatedTotal)
    ]);

    // if all the products in the order have been cancelled then cancel the order as a whole
    const isAllCancelled = order.items
      .filter((item) => item.productId.toString() !== productId)
      .every((item) => item.cancelled);

    //cancelling the full order
    if (isAllCancelled) {
      await cancelOrderById(orderId,0);
    }
  } else {
    // cancel the order
    await cancelOrderById(orderId,0);

    //increase the product count after increasing the order
    await updateProductStock(order.item.productId, order.item.count);
  }

  const resData = {
    status: 'success',
    message: 'Successfully cancelled the order'
  };
  sendResponse(201, resData, res);
});

//@desc   Return an order
//@route  PATCH /api/returnproduct
//@access private
const returnOrder = asyncHandler(async (req, res) => {
  const { orderId, productId } = req.body;

  //check if all the data is present
  if (!orderId || !productId) {
    throw new AppError('Please send all the data', 400);
  }

  // find the corresponding order details
  const order = await findOrderByOrderId(orderId);

  // check if orderId was invalid
  if (!order) {
    throw new AppError('No orders found !', 400);
  }

  //check whether order has not been delivered
  if (order.orderStatus !== 'Delivered') {
    throw new AppError('Order has not been delivered !', 400);
  }
  // checking if the order has multiple products
  if (order?.items) {
    // find the corresponding item details
    const orderedItemDetails = order.items.find((item) => item.productId.toString() === productId);

    // check if the individual product has not been cancelled
    if (orderedItemDetails.cancelled) {
      throw new AppError('Order has already been cancelled', 400);
    }
    //change the order status of the product to returned
    await returnIndividualOrder(orderId, productId, orderedItemDetails.subTotalDiscounted);

    //recalculate the total price of the order
    const updatedTotal = order.totalAmountDiscounted - orderedItemDetails.subTotalDiscounted;

    //change the product stock after cancelling the order,update the total order price
    await Promise.all([
      updateProductStock(orderedItemDetails.productId, orderedItemDetails.count),
      updateOrderTotal(orderId, updatedTotal)
    ]);
  } else {
    // return the order
    await returnOrderById(orderId, order?.subTotalDiscounted);

    //increase the product count after returning the product
    await updateProductStock(order.item.productId, order.item.count);
  }
  const resData = {
    status: 'success',
    message: 'Successfully made the return product request'
  };
  sendResponse(201, resData, res);
});

//@desc   Generate invoice for an order
//@route  GET /api/getinvoice/:id
//@access private
const generateInvoice = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  //find corresponding order details
  const { order } = await findOrderByOrderId(orderId);

  //throw error if order is invalid
  if (!order) {
    throw new AppError('Did not find any order with this orderId', 400);
  }

  //check whether order has not been delivered
  if (order.orderStatus !== 'Delivered') {
    throw new AppError('Order has not been delivered !', 400);
  }

  //parsing data for better reading
  order.created = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  order.orderedOn = new Date(order.orderedOn).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  order.orderStatusUpdatedOn = new Date(order.orderStatusUpdatedOn).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  order.totalAmountDiscounted = order.totalAmountDiscounted.toLocaleString();
  if (order?.item) {
    order.item.discountedPrice = order.item.discountedPrice.toLocaleString();
  }
  if (order?.items) {
    order.items = order.items.filter((item) => {
      item.discountedPrice = item.discountedPrice.toLocaleString();
      return !item.returned && !item.cancelled;
    });
  }
  const filePath = await generatePdf('invoice', order);
  //   res.set({
  //    ' Content-Type': 'image/png',
  // 'Content-Disposition': 'attachment'; 'filename'="picture.png"
  //   })
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  res.sendFile(filePath);
  await rm(filePath);
});

export default {
  updateCart,
  removeProductFromCart,
  moveToWishlist,
  listCartDetails,
  getCartTotal,
  updateWishlist,
  removeProductFromWishlist,
  moveToCart,
  listWishlistDetails,
  getCartAndWishlistCount,
  getUserDetails,
  editUserDetails,
  changeUserPassword,
  getAllAddresses,
  addNewAddress,
  editAddress,
  deleteAddress,
  checkCoupon,
  purchaseWithCod,
  createRazorpayOder,
  createPaypalOrder,
  verifyPaypal,
  checkPaymentStatus,
  listUserOrders,
  cancelOrder,
  returnOrder,
  generateInvoice
};
