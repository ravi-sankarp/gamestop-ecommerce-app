import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError.js';
import { findOrdersByUserId } from './orderHelpers.js';
import { findReviewByUserId } from './reviewHelpers.js';

const reviewEligibilityCheck = asyncHandler(async (_id, productId) => {
  // getting the data of the user
  const { orders } = await findOrdersByUserId(_id);

  // if orders was not found then throw an error
  if (!orders) {
    throw new AppError('You have not ordered anything till now !', 400);
  }
  // check if user has purchased the product
  const found = orders?.some((order) => {
    // check if the order has multiple orders
    if (order?.items) {
      const foundItem = order.items.find((item) => item.productId.toString() === productId);
      if (foundItem) {
        if (order.orderStatus === 'Delivered' || order.orderStatus === 'Returned') {
          return true;
        }
      }
    } else if (order?.item?.productId?.toString() === productId) {
      if (order?.orderStatus === 'Delivered' || order?.orderStatus === 'Returned') {
        return true;
      }
    }
    return false;
  });

  // if the user has not purchased the product then throw an error
  if (!found) {
    throw new AppError(
      'Purchase the product to post a review !',
      400
    );
  }

  // check if user has already reviewed the product
  const result = await findReviewByUserId(productId, _id);

  // if user has already purchased the product then throw an error
  if (result) {
    throw new AppError('You have already reviewed the product !', 400);
  }
});

export default reviewEligibilityCheck;
