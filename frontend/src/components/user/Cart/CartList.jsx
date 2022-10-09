/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from 'react';
import { Alert, Box, Divider, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import {
  useMoveToWishlistMutation,
  useRemoveFromCartMutation,
  useUpdateCartMutation
} from '../../../redux/api/userApiSlice';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import useSuccessHandler from '../../../hooks/useSuccessHandler';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';

function CartList({ data }) {
  const [checkoutError, setCheckoutError] = useState('');
  const [updateCart, { isLoading }] = useUpdateCartMutation();
  const [removeFromCart, { isLoading: removeProductIsLoading }] = useRemoveFromCartMutation();
  const [moveToWishlist, { isLoading: moveToWishlistIsLoading }] = useMoveToWishlistMutation();

  const navigate = useNavigate();

  const successToast = useSuccessHandler();

  const errorToast = useApiErrorHandler();

  const handleProductUpdate = async (productId, count) => {
    try {
      if (!isLoading) {
        const res = await updateCart({ productId, count }).unwrap();
        successToast(res);
      }
    } catch (err) {
      errorToast(err);
    }
  };

  const handleProductRemove = async (productId) => {
    try {
      if (!removeProductIsLoading) {
        const res = await removeFromCart({ id: productId }).unwrap();
        successToast(res);
      }
    } catch (err) {
      console.error(err);
      errorToast(err);
    }
  };

  const handleMoveToWishlist = async (productId) => {
    try {
      if (!moveToWishlistIsLoading) {
        const res = await moveToWishlist({ id: productId }).unwrap();
        successToast(res);
      }
    } catch (err) {
      console.error(err);
      errorToast(err);
    }
  };

  const handleCheckout = async () => {
    const outOfStock = data?.items.find((item) => item.productDetails.stock < item.count);

    if (outOfStock) {
      setCheckoutError(
        'One or more products in your cart is out of stock! Please remove those items from cart to checkout'
      );
      return;
    }
    navigate('/checkout');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { md: 'space-around' },
        flexDirection: { xs: 'column', md: 'row' },
        pl: 5
      }}
    >
      <Box
        sx={{
          flexGrow: { xs: 1, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 7,
          pr: { xs: 5, md: 0 },
          width: {
            md: '60vw'
          }
        }}
      >
        {data?.items.map((item) => (
          <Box
            key={item.productDetails.name}
            sx={{
              background: '#fff !important',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              boxShadow: ' 0 2px 5px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 1px 12px 2px #dbdbdb',
                transition: 'box-shadow 100ms linear'
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                '& img': {
                  width: '120px',
                  height: '80px',
                  objectFit: 'cover'
                }
              }}
            >
              <img
                src={item.productDetails.images[0].imgUrl}
                alt={item.productDetails.name}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  ml: { md: 4 }
                }}
              >
                <Typography>{item.productDetails.name}</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    pl: 3
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="subtitle"
                    sx={{ color: '#000', opacity: 1 }}
                  >
                    {`₹${item.productDetails.discountedPrice.toLocaleString()}`}
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{ textDecoration: 'line-through', opacity: 0.5 }}
                    variant="subtitle"
                  >
                    {`₹${item.productDetails.price.toLocaleString()}`}
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{ color: 'green', opacity: 0.8 }}
                    variant="subtitle"
                  >
                    {`(${item.productDetails.discount}% off )`}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  ml: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '',
                  gap: 1,
                  p: 1,
                  '& p': { color: '#000', fontSize: '1.1rem', opacity: 0.8 }
                }}
              >
                <Typography>Total</Typography>
                <Typography>₹{item.subTotal.toLocaleString()}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 4,
                pl: 1,
                pt: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <IconButton
                  onClick={() => handleProductUpdate(item.productDetails._id, -1)}
                  disabled={item.count < 2}
                  sx={{ color: '#000' }}
                >
                  <RemoveIcon />
                </IconButton>
                {item.count}
                <IconButton
                  sx={{ color: '#000' }}
                  onClick={() => handleProductUpdate(item.productDetails._id, 1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography
                onClick={() => handleProductRemove(item.productDetails._id)}
                sx={{ pl: { md: 4 }, '&:hover': { color: '#1a6aed', cursor: 'pointer' } }}
              >
                REMOVE
              </Typography>
              <Typography
                onClick={() => handleMoveToWishlist(item.productDetails._id)}
                sx={{ '&:hover': { color: '#1a6aed', cursor: 'pointer' } }}
              >
                MOVE TO WISHLIST
              </Typography>
            </Box>
            {item.productDetails.stock < item.count && (
              <Typography
                gutterBottom
                textAlign="right"
                sx={{ color: 'red', opacity: 0.8 }}
                variant="subtitle"
              >
                Product is currently out of stock
              </Typography>
            )}
          </Box>
        ))}
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
          <Typography>Price ({data.items.length} items)</Typography>
          <Typography>₹{data.total.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Discount</Typography>
          <Typography sx={{ color: 'green' }}>
            <RemoveIcon sx={{ fontSize: 12 }} /> ₹
            {(data.total - data.discountedTotal).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Delivery Charges</Typography>
          <Typography sx={{ color: 'green' }}>FREE</Typography>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Total Amount</Typography>
          <Typography>₹{data.discountedTotal.toLocaleString()}</Typography>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ color: 'green' }}>
            You will save ₹{(data.total - data.discountedTotal).toLocaleString()} on this order
          </Typography>
        </Box>
        {checkoutError && <Alert severity="error">{checkoutError}</Alert>}
        <PrimaryButton
          onClick={handleCheckout}
          sx={{ mx: { xs: 20, md: 4 } }}
        >
          Proceed to Checkout
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default CartList;
