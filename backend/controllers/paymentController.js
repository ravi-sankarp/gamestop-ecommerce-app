import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import { deleteCartByUserId } from '../helpers/cartHelpers.js';
import { changeOrderStatus } from '../helpers/orderHelpers.js';
import * as paymentHelpers from '../helpers/paymentHelpers.js';

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

    // changing the order status to order placed
    await changeOrderStatus(result?.orderId, 'Order Placed');

    //empty cart after placing the order
    await deleteCartByUserId(result.userId);

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

//@desc   Verify Paypal webhook
//@route  POST /api/verifypaypalpayment
//@access public
// const verifyPaypalPayment = asyncHandler(async (req, res) => {
//   try {
//     const { headers } = req;
//     const url = 'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature';
//     const body = {
//       transmission_id: headers['paypal-transmission-id'],
//       transmission_time: headers['paypal-transmission-time'],
//       cert_url: headers['paypal-cert-url'],
//       auth_logo: headers['paypal-auth-logo'],
//       transmission_sig: headers['paypal-transmission-sig'],
//       webhook_id: process.env.PAYPAL_WEBHOOK_ID,
//       webhook_event: req.body
//     };
//     const options = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
//         'Content-Type': 'application/json'
//       }
//     };
//     const result = await axios.post(url, body, options);
//     console.log(result);
//     res.json({
//       status: 'success'
//     });
//   } catch (err) {
//     console.log(err);
//     res.json({
//       status: 'success'
//     });
//   }
// });

export default {
  verifyRazorpayPayment,
  // verifyPaypalPayment
};
