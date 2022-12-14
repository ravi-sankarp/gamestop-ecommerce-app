import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError.js';
import { findCartByUserId } from './cartService.js';
import { addUserToCouponAppliedList, findByCouponCode } from './couponService.js';
import { createNewOrder } from './orderService.js';
import { updateProductStock } from './productService.js';
import { findWalletByUserId } from './walletService.js';

const createAnOrder = asyncHandler(
  async (user, addressId, couponCode, orderStatus, paymentMethod) => {
    // variable for storing orderId after successfully creating an order
    let orderId;

    //throwing error if address Id is not present
    if (!addressId) {
      throw new AppError('Please sent the required data', 400);
    }
    //Getting delivery address using address id
    const address = user.addresses.find((data) => data.id.toString() === addressId);

    //checking if address is valid
    if (!address) {
      throw new AppError('Invalid address Id', 400);
    }
    const [cart] = await findCartByUserId(user._id);

    //checking if cart is empty
    if (!cart) {
      throw new AppError('Your cart is empty', 400);
    }

    //check if any product is out of stock
    const outOfStock = cart.items.find((item) => item.productDetails.stock < item.count);
    if (outOfStock) {
      throw new AppError(
        'One or Two items in your cart is out of stock ! Cannnot place order',
        400
      );
    }

    let couponDetails;

    if (couponCode) {
      couponDetails = await findByCouponCode(couponCode);
      if (!couponDetails) {
        throw new AppError('Invalid coupon !', 400);
      }

      //check if user has already applied the coupon
      const found = couponDetails?.users?.find(
        (userId) => userId.toString() === user._id.toString()
      );
      if (found) {
        throw new AppError('You have already applied the coupon!', 400);
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

      //check if coupon code has expired
      if (couponDetails.expiryDate <= new Date()) {
        throw new AppError('Coupon has expired', 400);
      }
    }

    // calculating total order price if coupon is applied
    const cartDiscountAmount = couponDetails
      ? Math.ceil(cart.discountedTotal * couponDetails.discount * 0.01)
      : 0;

    // if payment method is via wallet check if the user has available balance
    if (paymentMethod === 'Wallet') {
      const wallet = await findWalletByUserId(user._id);
      if (wallet?.balance < cart.discountedTotal - cartDiscountAmount) {
        throw new AppError('Insufficient Balance in Wallet !', 400);
      }
    }

    //If cart contains more than 1 product then create and order and each item as a suborder
    if (cart.items.length > 1) {
      const items = cart.items.map((item) => ({
        productId: item.productDetails._id,
        productName: item.productDetails.name,
        originalPrice: item.productDetails.discountedPrice,
        discountedPrice: couponDetails
          ? item.productDetails.discountedPrice - Math.ceil(cartDiscountAmount / cart.items.length)
          : item.productDetails.discountedPrice,
        count: item.count,
        cancelled: false,
        returned: false,
        subTotal: item.subTotal,
        subTotalDiscounted: couponDetails
          ? item.subTotal - Math.ceil(cartDiscountAmount / cart.items.length)
          : item.subTotal,
        imgUrl: item.productDetails.images[0].imgUrl
      }));
      const data = {
        orderedOn: new Date(),
        paymentMethod: paymentMethod ?? 'COD',
        deliveryAddress: address,
        couponApplied: couponCode || null,
        cancelledAmount: 0,
        returnedAmount: 0,
        couponDiscount: couponDetails?.discount ?? null,
        totalProducts: cart.items.length,
        orderStatus: orderStatus ?? 'Order Placed',
        orderStatusUpdatedOn: new Date(),
        totalAmountOriginal: cart.discountedTotal,
        totalAmountDiscounted: cart.discountedTotal - cartDiscountAmount,
        items,
        totalAmountDiscountedOriginal: cart.discountedTotal - cartDiscountAmount
      };
      orderId = await createNewOrder(user._id, data);
      //decrease product stock after placing the order
      if (!paymentMethod) {
        await Promise.all(
          cart.items.map(
            async (item) => await updateProductStock(item.productDetails._id, -item.count)
          )
        );
      }
    } else {
      const data = {
        orderedOn: new Date(),
        paymentMethod: paymentMethod ?? 'COD',
        deliveryAddress: address,
        totalProducts: 1,
        couponApplied: couponCode || null,
        couponDiscount: couponDetails?.discount ?? null,
        orderStatus: orderStatus ?? 'Order Placed',
        totalAmountOriginal: cart.discountedTotal,
        totalAmountDiscounted: cart.discountedTotal - cartDiscountAmount,
        totalAmountDiscountedOriginal: cart.discountedTotal - cartDiscountAmount,
        orderStatusUpdatedOn: new Date(),
        cancelledAmount: 0,
        returnedAmount: 0,
        item: {
          productId: cart.items[0].productDetails._id,
          productName: cart.items[0].productDetails.name,
          price: cart.items[0].productDetails.discountedPrice,
          count: cart.items[0].count,
          cancelled: false,
          returned: false,
          imgUrl: cart.items[0].productDetails.images[0].imgUrl,
          subTotal: cart.items[0].subTotal,
          subTotalDiscounted: couponDetails
            ? cart.items[0].subTotal - cartDiscountAmount
            : cart.items[0].subTotal
        }
      };
      orderId = await createNewOrder(user._id, data);
      if (!paymentMethod) {
        await updateProductStock(cart.items[0].productDetails._id, -cart.items[0].count);
      }
    }

    // if a coupon was applied then add the user to the list of users who have applied the coupon
    if (couponDetails) {
      await addUserToCouponAppliedList(couponDetails.code, user._id);
    }
    return { orderId, total: cart.discountedTotal - cartDiscountAmount };
  }
);

export default createAnOrder;
