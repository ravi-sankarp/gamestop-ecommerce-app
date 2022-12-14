import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import { deleteCartByUserId } from '../services/cartService.js';
import { changeOrderStatus } from '../services/orderService.js';
import * as paymentHelpers from '../services/paymentService.js';
import { updateWalletBalance } from '../services/walletService.js';

//@desc   Verify Razorpay Webhook
//@route  POST /api/verifyrazorpaypayment
//@access public
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  // razorpay web hook secret
  const secret = process.env.RAZORPAY_WEB_HOOK_SECRET;

  // checking if the data is valid by creating a checksum and verifying
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  // checking if checksum matches
  if (digest === req.headers['x-razorpay-signature']) {
    const paymentId = req.body.payload.payment.entity.order_id;
    const updateData = {
      status: 'success',
      method: req.body.payload.payment.entity.method,
      bankTransactionId: req.body.payload.payment.entity.acquirer_data.bank_transaction_id
    };

    // updating the payment data to the database
    const result = await paymentHelpers.updatePaymentDetails(paymentId, updateData);
    if (result.operation === 'Add to Wallet') {
      const walletDataReferredUser = {
        operation: result.operation,
        paymentId: result.paymentId,
        mode: 'credit',
        amount: result.amount
      };
      // adding the amount to the user wallet
      await updateWalletBalance(result.userId, walletDataReferredUser);
    } else {
      // changing the order status to order placed
      await changeOrderStatus(result?.orderId, 'Order Placed');

      //empty cart after placing the order
      await deleteCartByUserId(result.userId);
    }

    res.json({
      status: 'success'
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized request'
    });
  }
});

export default {
  verifyRazorpayPayment
  // verifyPaypalPayment
};
