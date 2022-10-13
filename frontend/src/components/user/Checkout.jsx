/* eslint-disable react/jsx-one-expression-per-line */
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PrimaryButton } from '../../MaterialUiConfig/styled';
import {
  useCreatePaypalOrderMutation,
  useCreateRazorpayOrderMutation,
  usePurchaseWithCodMutation,
  useVerifyPaypalMutation
} from '../../redux/api/userApiSlice';
import UserAddressForm from './Forms/UserAddressForm';
import RazorPayPayment from './Payments/RazorPayPayment';

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

function Checkout({ cartData, addressData, addressMessage }) {
  const [search, setSearch] = useSearchParams();

  const paymentId = search.get('paymentId');
  const payerId = search.get('PayerID');
  const [open, setOpen] = useState(false);
  const [btnText, setBtnText] = useState('Confirm Order');
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [addressId, setAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [razorpayOrderDetails, setRazorpayOrderDetails] = useState(false);
  const [paypalRedirectUrl, setPaypalRedirectUrl] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [successModal, setSuccessModal] = useState(false);

  const navigate = useNavigate();

  const [confirmOrder, { isLoading: confirmOrderIsLoading }] = usePurchaseWithCodMutation();
  const [razorpayOrder, { isLoading: razorpayOrderIsLoading }] = useCreateRazorpayOrderMutation();
  const [paypalOrder, { isLoading: paypalOrderIsLoading }] = useCreatePaypalOrderMutation();
  const [paypalVerify, { isLoading: paypalVerifyIsLoading }] = useVerifyPaypalMutation();

  useEffect(() => {
    if (paypalRedirectUrl) {
      const paypalCreateOrder = async () => {
        await loadScript(
          `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`
        );
        window.location.assign(paypalRedirectUrl);
      };
      paypalCreateOrder();
    }
  }, [paypalRedirectUrl]);

  useEffect(() => {
    if (paymentId && payerId) {
      window.history.replaceState({ id: 1 }, '');
      const handleVerifyPaypal = async () => {
        try {
          if (!paypalVerifyIsLoading) {
            setPaypalLoading(true);
            const res = await paypalVerify({ paymentId, payerId }).unwrap();
            setPaypalLoading(false);
            setMessage(res.message);
            setSuccessModal(true);
            setError('');
          }
        } catch (err) {
          setPaypalLoading(false);
          console.error(err);
          setError(err.data.message ?? 'Something went wrong');
          search.delete('paymentId');
          search.delete('PayerId');
          setSearch(search);
        }
      };
      handleVerifyPaypal();
    }
  }, [paymentId, payerId, paypalVerifyIsLoading, paypalVerify, search, setSearch]);
  const toggleForm = () => {
    setOpen((current) => !current);
  };

  const handleSelectAddress = (e) => {
    setAddressId(e.target.value);
  };

  const handlePaymentSelection = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCashOnDelivery = async () => {
    try {
      if (!confirmOrderIsLoading) {
        setBtnText('Loading...');
        const res = await confirmOrder({ addressId }).unwrap();
        setMessage(res.message);
        setSuccessModal(true);
        setError('');
        setBtnText('Confirm Order');
      }
    } catch (err) {
      console.error(err);
      setError(err.data.message || 'Something went wrong');
      setBtnText('Confirm Order');
    }
  };

  const handleRazorpayOrder = async () => {
    try {
      if (!razorpayOrderIsLoading) {
        setBtnText('Loading...');
        const data = await razorpayOrder({ addressId }).unwrap();
        setRazorpayOrderDetails(data.data);
        setError('');
        setBtnText('Confirm Order');
      }
    } catch (err) {
      console.error(err);
      setError(err.data.message ?? 'Something went wrong');
      setBtnText('Confirm Order');
    }
  };

  const handlePaypalPayment = async () => {
    try {
      if (!paypalOrderIsLoading) {
        setBtnText('Loading...');
        const data = await paypalOrder({ addressId }).unwrap();
        setPaypalRedirectUrl(data.data);
        setError('');
        setBtnText('Confirm Order');
      }
    } catch (err) {
      console.error(err);
      setError(err.data.message ?? err?.data?.response?.message ?? 'Something went wrong');
      setBtnText('Confirm Order');
    }
  };

  const handleConfirmOrder = () => {
    if (!addressId) {
      setError('Please select a delivery address');
      return;
    }
    if (!paymentMethod) {
      setError('Please select a payment method');

      return;
    }
    switch (paymentMethod) {
      case 'cod':
        handleCashOnDelivery();
        break;
      case 'razorpay':
        handleRazorpayOrder();
        break;
      case 'paypal':
        handlePaypalPayment();
        break;
      default:
        break;
    }
  };

  const handleGotoOrders = () => {
    navigate('/profile?profile=orders', { replace: true });
    setSuccessModal(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { md: 'space-around' },
        flexDirection: { xs: 'column', md: 'row' },
        pl: 5,
        gap: 3
      }}
    >
      <Box
        sx={{
          flexGrow: { xs: 1, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 7,
          mr: { xs: 5, md: 0 },
          width: {
            md: '60vw'
          }
        }}
      >
        <FormControl sx={{ backgroundColor: '#fff', p: 4 }}>
          {addressData && (
            <>
              <FormLabel
                id="Address-radio-buttons-group-label"
                sx={{ color: '#000' }}
              >
                Select Delivery Address
              </FormLabel>
              <RadioGroup
                aria-labelledby="Address-radio-buttons-group-label"
                name="addressId"
                value={addressId}
                onChange={handleSelectAddress}
              >
                {addressData?.map((address) => (
                  <FormControlLabel
                    control={<Radio />}
                    sx={{
                      my: 3,
                      '& span': {
                        fontSize: '1.2rem'
                      }
                    }}
                    key={address.id}
                    disabled={open}
                    value={address.id}
                    label={`${address.name},
                ${address.houseName}, ${address.streetName}, ${address.city}, ${address.district}, ${address.state} -
                ${address.pincode}`}
                  />
                ))}
              </RadioGroup>
            </>
          )}
          {addressMessage && (
            <Typography
              variant="h6"
              textAlign="center"
            >
              {addressMessage}
            </Typography>
          )}
          <PrimaryButton
            onClick={toggleForm}
            sx={{ mx: 'auto' }}
          >
            Add new Address
          </PrimaryButton>
        </FormControl>
        {open && (
          <UserAddressForm
            open={open}
            toggleForm={toggleForm}
          />
        )}
      </Box>
      <Box
        sx={{
          flexGrow: { xs: 1, md: 0 },

          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mr: { xs: 5, md: 4 },
          background: '#fff !important',
          boxShadow: ' 0 2px 5px 0 rgba(0, 0, 0, 0.1)',
          mb: 7,
          padding: '10px 0',
          width: { md: '20vw' },
          height: 'max-content',
          '& div': {
            pl: 2,
            pr: 2
          }
        }}
      >
        <Typography sx={{ pl: 2 }}>PRICE DETAILS</Typography>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Price ({cartData.totalProducts} items)</Typography>
          <Typography>₹{cartData.total.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Discount</Typography>
          <Typography sx={{ color: 'green' }}>
            <RemoveIcon sx={{ fontSize: 12 }} /> ₹
            {(cartData.total - cartData.discountedTotal).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Delivery Charges</Typography>
          <Typography sx={{ color: 'green' }}>FREE</Typography>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Total Amount</Typography>
          <Typography>₹{cartData.discountedTotal.toLocaleString()}</Typography>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ color: 'green' }}>
            You will save ₹{(cartData.total - cartData.discountedTotal).toLocaleString()} on this
            order
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            sx={{ textAlign: 'center' }}
          >
            Selct a payment Method
          </Typography>

          <FormControl>
            <RadioGroup
              aria-labelledby="select-payment-radio-buttons-group-label"
              value={paymentMethod}
              name="radio-buttons-group"
              onChange={handlePaymentSelection}
            >
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash On Delivery"
              />
              <FormControlLabel
                value="razorpay"
                control={<Radio />}
                label="Razorpay"
              />
              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label="Paypal"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        {error && (
          <Alert
            severity="error"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'normal', md: 'center' }
            }}
          >
            {error}
          </Alert>
        )}

        <PrimaryButton
          onClick={handleConfirmOrder}
          sx={{ mx: { xs: 2, md: 4 } }}
        >
          {btnText}
        </PrimaryButton>
      </Box>
      {razorpayOrderDetails && (
        <RazorPayPayment
          setMessage={setMessage}
          setSuccessModal={setSuccessModal}
          data={razorpayOrderDetails}
        />
      )}
      <Dialog
        open={successModal}
        onClose={setSuccessModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <img
            src="/imgs/success.png"
            alt="Success"
            width="100%"
          />
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5">{message}</Typography>
          <Box sx={{ mt: 4 }}>
            <Typography
              component="span"
              variant="h6"
              textAlign="center"
              onClick={handleGotoOrders}
              sx={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
            >
              Click here
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              component="span"
            >
              to go to orders page
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={paypalLoading}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ minWidth: '30vw', minHeight: '40vh' }}
      >
        <DialogTitle>Payment Verification </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5">{message}</Typography>
          <Box sx={{ mt: 4 }}>
            <Typography
              component="span"
              variant="h5"
              textAlign="center"
              sx={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
            >
              Payment is currently being verified
              <LoadingButton
                loading
                variant="text"
              />
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Checkout;
