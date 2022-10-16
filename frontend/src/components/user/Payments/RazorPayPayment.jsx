import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import { useCheckPaymentStatusQuery } from '../../../redux/api/userApiSlice';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const handleRazorpayPayment = async (data, setPaymentOrderId, handleError) => {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

  if (!res) {
    const err = {
      data: { message: 'Unable to load script ! Please check your internet connection' }
    };
    handleError(err);
    return;
  }

  const { amount, orderId, currency, prefill } = data;

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: amount.toString(),
    currency,
    name: 'Gamestop',
    description: 'Test Transaction',
    image: '/imgs/gamestoplogo.png',
    order_id: orderId,
    handler: (response) => {
      setPaymentOrderId(response.razorpay_order_id);
    },
    prefill,
    notes: {
      address: 'Gamestop Inforpark Kochi'
    },
    theme: {
      color: '#61dafb'
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
  paymentObject.on('payment.failed', (response) => {
    handleError(response.error);
  });
};

function RazorPayPayment({ setSuccessModal, setMessage, data }) {
  const [paymentOrderId, setPaymentOrderId] = useState(false);
  const {
    data: paymentStatus,
    isLoading: isLoadingPaymentStatus,
    isFetching: isFetchingPaymentStatus,
    isError: isErrorPaymentStatus,
    isSuccess: isSuccessPaymentStatus,
    error: errorPaymentStatus
  } = useCheckPaymentStatusQuery(
    { id: paymentOrderId },
    { refetchOnMountOrArgChange: true, skip: !paymentOrderId }
  );
  const handleError = useApiErrorHandler();
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!renderedRef.current) {
      handleRazorpayPayment(data, setPaymentOrderId, handleError);
    }
    return () => {
      renderedRef.current = true;
    };
  }, [data, handleError]);

  useEffect(() => {
    if (isErrorPaymentStatus) {
      handleError(errorPaymentStatus);
    }
  }, [handleError, isErrorPaymentStatus, errorPaymentStatus]);

  let content;
  if (isLoadingPaymentStatus || (isFetchingPaymentStatus && !isSuccessPaymentStatus)) {
    content = (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          backgroundColor: '#4d4d4d',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          display: 'flex',
          zIndex: '100',
          alignItems: 'center',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <CircularProgress
          sx={{ overflow: 'hidden', zIndex: '150', color: '#ddd' }}
          size="50px"
        />
      </Box>
    );
  }
  useEffect(() => {
    if (isSuccessPaymentStatus) {
      if (paymentStatus?.status === 'success') {
        setSuccessModal(true);
        setMessage(paymentStatus?.message);
      } else {
        handleError(paymentStatus);
      }
    }
  }, [handleError, isSuccessPaymentStatus, paymentStatus, setMessage, setSuccessModal]);
  return content;
}

export default RazorPayPayment;
