import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//Place an order
export const createNewOrder = asyncHandler(async (id, data) => {
  const userId = ObjectId(id);
  data.orderId = new ObjectId();
  await getDb().collection('orders').insertOne({
    userId,
    order: data
  });
  return data.orderId;
});

//find orders with user id
export const findOrdersByUserId = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  const agg = [
    {
      $match: {
        userId,
        'order.orderStatus':{
          $ne:'Order Pending'
        }
      }
    },
    {
      $sort: {
        'order.orderedOn': -1
      }
    },
    {
      $group: {
        _id: '$userId',
        orders: {
          $push: '$order'
        }
      }
    }
  ];

  const result = await getDb().collection('orders').aggregate(agg).toArray();

  return result[0];
});

//find all orders
export const findAllOrders = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        'order.orderStatus': {
          $ne: 'Order Pending'
        }
      }
    },
    {
      $sort: {
        'order.orderedOn': -1
      }
    },
    {
      $group: {
        _id: null,
        orders: {
          $push: '$order'
        }
      }
    }
  ];

  const result = await getDb().collection('orders').aggregate(agg).toArray();
  return result[0].orders;
});

//find order by Order id
export const findOrderByOrderId = asyncHandler(async (id) => {
  const orderId = ObjectId(id);

  const result = await getDb().collection('orders').findOne({ 'order.orderId': orderId });
  return result;
});

//cancel order
export const cancelOrderById = asyncHandler(async (odID, amount = 0) => {
  const orderId = ObjectId(odID);
  await getDb()
    .collection('orders')
    .updateOne(
      { 'order.orderId': orderId },
      {
        $set: {
          'order.orderStatus': 'Cancelled By User',
          'order.orderStatusUpdatedOn': new Date(),
          'order.totalAmountDiscounted': 0
        },

        $inc: { 'order.returnedAmount': amount }
      }
    );
});

//cancel an individual order in an order with multiple products
export const cancelIndividualOrder = asyncHandler(async (odId, proId, cancelledAmount) => {
  const orderId = ObjectId(odId);
  const productId = ObjectId(proId);
  await getDb()
    .collection('orders')
    .updateOne(
      { 'order.orderId': orderId, 'order.items.productId': productId },
      {
        $set: {
          'order.items.$.cancelled': true
        },

        $inc: {
          'order.cancelledAmount': cancelledAmount,
          'order.totalAmountDiscounted': -cancelledAmount
        }
      }
    );
});

//return an individual order in an order with multiple products
export const returnIndividualOrder = asyncHandler(async (odId, proId, returnedAmount) => {
  const orderId = ObjectId(odId);
  const productId = ObjectId(proId);
  await getDb()
    .collection('orders')
    .updateOne(
      { 'order.orderId': orderId, 'order.items.productId': productId },
      {
        $set: {
          'order.items.$.returned': true
        },
        $inc: {
          'order.returnedAmount': returnedAmount,
          'order.totalAmountDiscounted': -returnedAmount
        }
      }
    );
});

//return order
export const returnOrderById = asyncHandler(async (odID, amount = 0) => {
  const orderId = ObjectId(odID);
  await getDb()
    .collection('orders')
    .updateOne(
      { 'order.orderId': orderId },
      {
        $set: {
          'order.orderStatus': 'Returned',
          'order.orderStatusUpdatedOn': new Date(),
          'order.totalAmountDiscounted': 0
        },

        $inc: { 'order.returnedAmount': amount }
      }
    );
});

//update total amount after cancelling or returning an order
export const updateOrderTotal = asyncHandler(async (odID, total) => {
  const orderId = ObjectId(odID);
  await getDb()
    .collection('orders')
    .updateOne(
      { 'order.orderId': orderId },
      {
        $set: { 'order.totalAmountDiscounted': total }
      }
    );
});

//update order status
export const changeOrderStatus = asyncHandler(async (odId, status) => {
  const orderId = ObjectId(odId);
  await getDb()
    .collection('orders')
    .updateOne(
      { 'order.orderId': orderId },
      {
        $set: { 'order.orderStatus': status, 'order.orderStatusUpdatedOn': new Date() }
      }
    );
});

//find total orders count
export const findTotalOrders = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        'order.orderStatus': {
          $ne: 'Order Pending'
        }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: {
          $sum: 1
        }
      }
    }
  ];
  const [count] = await getDb().collection('orders').aggregate(agg).toArray();
  return count;
});

//find total orders amount
export const findTotalOrderAmount = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        'order.orderStatus': {
          $ne: 'Order Pending'
        }
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: '$order.totalAmountDiscounted'
        }
      }
    }
  ];

  const [count] = await getDb().collection('orders').aggregate(agg).toArray();
  return count;
});

// find the number of orders with each payment method
export const countOrdersWithSamePaymentMethod = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        'order.orderStatus': {
          $ne: 'Order Pending'
        }
      }
    },
    {
      $group: {
        _id: '$order.paymentMethod',
        orders: {
          $sum: 1
        }
      }
    }
  ];

  const count = await getDb().collection('orders').aggregate(agg).toArray();
  return count;
});

// find the number of orders with each payment method
export const getLastWeekOrders = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        'order.orderStatus': {
          $ne: 'Order Pending'
        },
        'order.orderedOn': {
          $gt: new Date(new Date() - 6 * 60 * 60 * 24 * 1000)
        }
      }
    },
    {
      $project: {
        day: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$order.orderedOn'
          }
        }
      }
    },
    {
      $group: {
        _id: '$day',
        orders: {
          $sum: 1
        }
      }
    }
  ];

  const count = await getDb().collection('orders').aggregate(agg).toArray();
  return count;
});
