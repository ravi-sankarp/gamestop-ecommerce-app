import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//Find all payments
export const findAllPayments = asyncHandler(async (query) => {
  const agg = [
    {
      $match: {
        status: {
          $ne: 'Pending'
        }
      }
    },
    {
      $sort: {
        createdOn: -1
      }
    }
  ];

  if (query?.mode) {
    const { mode } = query;
    if (mode === 'Credit') {
      agg.unshift({ $match: { mode: 'credit' } });
    } else if (mode === 'Debit') {
      agg.unshift({ $match: { mode: 'debit' } });
    }
  }

  const payments = await getDb().collection('payments').aggregate(agg).toArray();
  return payments;
});

//create new payment
export const createNewPayment = asyncHandler(async (id, odId, data) => {
  const userId = ObjectId(id);
  let orderId = odId;
  if (odId) {
    orderId = ObjectId(odId);
  }
  const result = await getDb()
    .collection('payments')
    .insertOne({
      userId,
      orderId,
      createdOn: new Date(),
      ...data
    });
  return result.insertedId;
});

// update payment status
export const updatePaymentDetails = asyncHandler(async (paymentId, data) => {
  const result = await getDb()
    .collection('payments')
    .findOneAndUpdate(
      { paymentId },
      {
        $set: {
          ...data
        }
      },
      { new: true }
    );
  return result.value;
});

// find a payment document by payment id
export const findByPaymentId = asyncHandler(async (paymentId) => {
  const result = await getDb().collection('payments').findOne({ paymentId });
  return result;
});

// find a payment documnent by order id
export const findByOrderId = asyncHandler(async (odId) => {
  const orderId = ObjectId(odId);
  const result = await getDb().collection('payments').findOne({ orderId });
  return result;
});
