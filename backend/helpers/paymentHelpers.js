import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//Find all payments
export const findAllPayments = asyncHandler(async () => {
  const payments = await getDb().collection('payments').find().sort({ createdOn: -1 }).toArray();
  return payments;
});

//create new payment
export const createNewPayment = asyncHandler(async (id, odId, gateway, paymentId,amount) => {
  const userId = ObjectId(id);
  const orderId = ObjectId(odId);
  const result = await getDb().collection('payments').insertOne({
    userId,
    orderId,
    status: 'pending',
    gateway,
    paymentId,
    amount,
    createdOn: new Date()
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

export const findByPaymentId = asyncHandler(async (paymentId) => {
  const result = await getDb().collection('payments').findOne({ paymentId });
  return result;
});
