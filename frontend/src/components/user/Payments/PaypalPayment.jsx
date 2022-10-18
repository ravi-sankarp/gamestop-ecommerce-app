import { Box, CircularProgress } from '@mui/material';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js';
import { useVerifyPaypalMutation } from '../../../redux/api/userApiSlice';

export default function PaypalPayment({ totalAmount, handlePayment, setSuccessModal }) {
  return (
    <PayPalScriptProvider
      options={{
        'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture'
      }}
    >
      <PaypalButtonComponent
        setSuccessModal={setSuccessModal}
        handlePayment={handlePayment}
        totalAmount={totalAmount}
      />
    </PayPalScriptProvider>
  );
}

function PaypalButtonComponent({ totalAmount, handlePayment, setSuccessModal }) {
  const amount = Math.ceil(totalAmount / 80);
  const [{ isPending }] = usePayPalScriptReducer();

  // useEffect(() => {
  //   dispatch({
  //     type: 'resetOptions',
  //     value: {}
  //   });
  // }, [amount]);

  const [paypalVerify, { isLoading: paypalVerifyIsLoading }] = useVerifyPaypalMutation();

  const handleApprove = async (data) => {
    try {
      if (!paypalVerifyIsLoading) {
        await paypalVerify({
          paymentId: data.paymentID,

          payerId: data.payerID
        }).unwrap();
        setSuccessModal(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'content' }}>
          <CircularProgress
            sx={{ overflow: 'hidden' }}
            color="primary"
          />
        </Box>
      )}
      {!isPending && (
        <PayPalButtons
          style={{ color: 'blue', tagline: false, label: 'pay' }}
          forceReRender={[amount]}
          createOrder={async () => {
            const result = await handlePayment();
            return result.data.id;
          }}
          onApprove={handleApprove}
        />
      )}
    </>
  );
}
