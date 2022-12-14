import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//Find wallet of a user
export const findWalletByUserId = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  const wallet = await getDb().collection('wallet').findOne({ userId });
  return wallet;
});

// create new wallet
export const createNewWallet = asyncHandler(async (id) => {
  const userId = ObjectId(id);
  await getDb().collection('wallet').insertOne({ userId, balance: 0 });
});

// update wallet balance
export const updateWalletBalance = asyncHandler(async (id, transactionData) => {
  const userId = ObjectId(id);
  transactionData.date = new Date();
  await getDb()
    .collection('wallet')
    .updateOne(
      { userId },
      {
        $inc: { balance: transactionData.amount },
        $push: { transactions: transactionData }
      }
    );
});
