/* eslint-disable consistent-return */
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
  TextField,
  Typography
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../MaterialUiConfig/styled';
import {
  useCheckCouponMutation,
  useCreatePaypalOrderMutation,
  useCreateRazorpayOrderMutation,
  usePurchaseWithCodMutation,
  usePurchaseWithWalletMutation
} from '../../redux/api/userApiSlice';
import UserAddressForm from './Forms/UserAddressForm';
import RazorPayPayment from './Payments/RazorPayPayment';
import useSuccessHandler from '../../hooks/useSuccessHandler';
import PaypalPayment from './Payments/PaypalPayment';

function Checkout({ cartData, addressData, addressMessage, walletBalance }) {
  const [open, setOpen] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [cartDiscountedTotal, setCartDiscountedTotal] = useState(
    cartData.discountedTotal - couponDiscount
  );
  const [btnText, setBtnText] = useState('Confirm Order');
  const [couponBtnTxt, setCouponBtnText] = useState('Check');
  const [addressId, setAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [couponErr, setCouponErr] = useState('');
  const [razorpayOrderDetails, setRazorpayOrderDetails] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [successModal, setSuccessModal] = useState(false);

  const [couponCode, setCouponCode] = useState('');

  const navigate = useNavigate();
  const successToast = useSuccessHandler();

  const [confirmOrder, { isLoading: confirmOrderIsLoading }] = usePurchaseWithCodMutation();
  const [walletPurchase, { isLoading: walletPurchaseIsLoading }] = usePurchaseWithWalletMutation();
  const [razorpayOrder, { isLoading: razorpayOrderIsLoading }] = useCreateRazorpayOrderMutation();
  const [paypalOrder, { isLoading: paypalOrderIsLoading }] = useCreatePaypalOrderMutation();
  const [checkCoupon, { isLoading: checkCouponIsLoading }] = useCheckCouponMutation();

  const toggleForm = () => {
    setOpen((current) => !current);
  };

  const handleSelectAddress = (e) => {
    setAddressId(e.target.value);
    setError('');
  };

  const handlePaymentSelection = (e) => {
    if (!addressId) {
      setError('Please select a delivery address first');
      return;
    }
    setError('');
    setPaymentMethod(e.target.value);
  };

  const handleCashOnDelivery = async () => {
    try {
      if (!confirmOrderIsLoading) {
        setBtnText('Loading...');
        const res = await confirmOrder({ addressId, couponCode }).unwrap();
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
  const handleWalletPurchase = async () => {
    try {
      if (!walletPurchaseIsLoading) {
        setBtnText('Loading...');
        const res = await walletPurchase({ addressId, couponCode }).unwrap();
        setMessage(res.message);
        setSuccessModal(true);
        setError('');
        setBtnText('Confirm Order');
      }
    } catch (err) {
      setError(err.data.message || 'Something went wrong');
      setBtnText('Confirm Order');
    }
  };

  const handleRazorpayOrder = async () => {
    try {
      if (!razorpayOrderIsLoading) {
        setBtnText('Loading...');
        const data = await razorpayOrder({ addressId, couponCode }).unwrap();
        setRazorpayOrderDetails(data.data);
        setError('');
        setBtnText('Confirm Order');
      }
    } catch (err) {
      setError(err.data.message ?? 'Something went wrong');
      setBtnText('Confirm Order');
    }
  };

  const handlePaypalPayment = async () => {
    setError('');
    try {
      if (!paypalOrderIsLoading) {
        const data = await paypalOrder({ addressId, couponCode }).unwrap();
        setError('');
        return data;
      }
    } catch (err) {
      setError(err.data.message ?? err?.data?.response?.message ?? 'Something went wrong');
      throw new Error('');
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
      case 'wallet':
        handleWalletPurchase();
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

  const handleCouponCheck = async () => {
    if (!couponCode) {
      setCouponErr('Please enter a valid coupon');
      return;
    }
    setCouponErr('');
    if (!checkCouponIsLoading) {
      try {
        setCouponBtnText('Loading...');
        const result = await checkCoupon({ code: couponCode }).unwrap();
        successToast(result);

        setCouponDiscount(cartData.discountedTotal * result.data.discount * 0.01);
        setCartDiscountedTotal(
          cartData.discountedTotal - cartData.discountedTotal * result.data.discount * 0.01
        );
        setCouponBtnText('Check');
      } catch (err) {
        setCouponBtnText('Check');
        setCouponCode('');
        setCouponErr(err?.data?.message);
      }
    }
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
        <Box sx={{ backgroundColor: '#fff', p: 3 }}>
          <Typography
            textAlign="center"
            variant="h6"
            sx={{
              fontSize: 18
            }}
          >
            Have a coupon ? Click here to apply
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
              id="filled-basic"
              label="Coupon Code"
              variant="outlined"
              color="primary"
              value={couponCode}
              autoComplete="off"
              onKeyDown={(e) => e.key === 'Enter' && handleCouponCheck()}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <PrimaryButton onClick={handleCouponCheck}>{couponBtnTxt}</PrimaryButton>
          </Box>
          <Typography
            color="red"
            textAlign="center"
          >
            {couponErr}
          </Typography>
        </Box>

        <FormControl sx={{ backgroundColor: '#fff', p: 4 }}>
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
        {!!couponDiscount && (
          <>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Coupon Discount</Typography>
              <Typography sx={{ color: 'green' }}>
                <RemoveIcon sx={{ fontSize: 12 }} /> ₹{couponDiscount.toLocaleString()}
              </Typography>
            </Box>
          </>
        )}
        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Total Amount</Typography>
          <Typography>₹{cartDiscountedTotal.toLocaleString()}</Typography>
        </Box>
        <Divider />

        {cartData.total > cartData.discountedTotal - couponDiscount && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography sx={{ color: 'green' }}>
              You will save ₹
              {(cartData.total - cartData.discountedTotal + couponDiscount).toLocaleString()} on
              this order
            </Typography>
          </Box>
        )}

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
                value="wallet"
                control={<Radio />}
                label={`Wallet (Balance - ₹${walletBalance?.toLocaleString('en-us')})`}
                sx={{ whiteSpace: 'nowrap' }}
                disabled={cartData.discountedTotal - couponDiscount > walletBalance}
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

        {paymentMethod !== 'paypal' && (
          <PrimaryButton
            onClick={handleConfirmOrder}
            sx={{ mx: { xs: 2, md: 4 } }}
          >
            {btnText}
          </PrimaryButton>
        )}
        {paymentMethod === 'paypal' && (
          <Box
            id="paypal-div"
            sx={{ display: 'flex', justifyContent: 'center', mr: { xs: 0, md: 3 } }}
          >
            <PaypalPayment
              setSuccessModal={setSuccessModal}
              handlePayment={handlePaypalPayment}
              totalAmount={cartDiscountedTotal}
            />
          </Box>
        )}
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
              Click here{' '}
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
    </Box>
  );
}

export default Checkout;
