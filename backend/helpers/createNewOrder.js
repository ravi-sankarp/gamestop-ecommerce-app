import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError.js';
import { findCartByUserId } from './cartHelpers.js';
import { createNewOrder } from './orderHelpers.js';
import { updateProductStock } from './productHelpers.js';

const createAnOrder = asyncHandler(async (user, addressId, orderStatus, paymentMethod) => {
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
    throw new AppError('One or Two items in your cart is out of stock ! Cannnot place order', 400);
  }

  //If cart contains more than 1 product then create and order and each item as a suborder
  if (cart.items.length > 1) {
    const items = cart.items.map((item) => ({
      productId: item.productDetails._id,
      productName: item.productDetails.name,
      price: item.productDetails.discountedPrice,
      count: item.count,
      cancelled: false,
      returned: false,
      subTotal: item.subTotal,
      imgUrl: item.productDetails.images[0].imgUrl
    }));
    const data = {
      orderedOn: new Date(),
      paymentMethod: paymentMethod ?? 'COD',
      deliveryAddress: address,
      totalProducts: cart.items.length,
      orderStatus: orderStatus ?? 'Order Placed',
      orderStatusUpdatedOn: new Date(),
      totalAmount: cart.discountedTotal,
      items
    };
    orderId = await createNewOrder(user._id, data);
    //decrease product stock after placing the order
    await Promise.all(
      cart.items.map(async (item) => await updateProductStock(item.productDetails._id, -item.count))
    );
  } else {
    const data = {
      orderedOn: new Date(),
      paymentMethod: paymentMethod ?? 'COD',
      deliveryAddress: address,
      totalProducts: 1,
      orderStatus: orderStatus ?? 'Order Placed',
      totalAmount: cart.discountedTotal,
      orderStatusUpdatedOn: new Date(),
      item: {
        productId: cart.items[0].productDetails._id,
        productName: cart.items[0].productDetails.name,
        price: cart.items[0].productDetails.discountedPrice,
        count: cart.items[0].count,
        cancelled: false,
        returned: false,
        imgUrl: cart.items[0].productDetails.images[0].imgUrl,
        totalAmount: cart.items[0].subTotal
      }
    };
    orderId = await createNewOrder(user._id, data);
    await updateProductStock(cart.items[0].productDetails._id, -cart.items[0].count);
  }
  return orderId;
});

export default createAnOrder;
