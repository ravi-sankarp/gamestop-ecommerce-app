import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Checkout from '../../components/user/Checkout';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useGetAddressesQuery, useGetCartTotalQuery } from '../../redux/api/userApiSlice';
import { PrimaryButton } from '../../MaterialUiConfig/styled';
import HelmetMeta from '../../components/HelmetMeta';

function CheckoutPage() {
  const {
    isLoading: isLoadingCart,
    isFetching: isFetchingCart,
    isError: isErrorCart,
    isSuccess: isSuccessCart,
    error,
    data: cartData,
    refetch
  } = useGetCartTotalQuery();
  const {
    isLoading: isLoadingAddress,
    isFetching: isFetchingAddress,
    isSuccess: isSuccessAddress,
    isError: isErrorAddress,
    data: addressData,
    error: errorAddress
  } = useGetAddressesQuery();
  const handleError = useApiErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {
    if (isErrorAddress) {
      handleError(errorAddress);
    }
  }, [isErrorAddress, errorAddress, handleError, navigate]);

  let content;
  if (
    isLoadingCart
    || (isFetchingCart && !isSuccessCart)
    || isLoadingAddress
    || (isFetchingAddress && !isSuccessAddress)
  ) {
    content = (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,0%)',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <CircularProgress
          sx={{ overflow: 'hidden' }}
          color="primary"
        />
      </Box>
    );
  }

  if (isErrorCart) {
    content = (
      <>
        <HelmetMeta title="Gamestop Checkout" />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            '& img': {
              width: '300px'
            }
          }}
        >
          <img
            src="
            https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
            alt="YOUR CART IS EMPTY"
          />
          <Typography variant="h6">{error.data.message}</Typography>
          <Typography sx={{ color: '#333333' }}>Add items to it now.</Typography>
          <PrimaryButton
            component={Link}
            to="/products?sort=recommended"
            sx={{ mt: 0 }}
          >
            Shop Now
          </PrimaryButton>
        </Box>
      </>
    );
  }
  return (
    <>
      <HelmetMeta title="Checkout | Gamestop" />
      <Box sx={{ overflowX: 'hidden', pt: 4, backgroundColor: '#f1f3f6' }}>
        <Typography
          variant="h4"
          sx={{ mb: '2rem', textAlign: 'center' }}
        >
          CHECKOUT
        </Typography>
        {content}
        {isSuccessAddress && isSuccessCart && (
          <Checkout
            refetch={refetch}
            addressMessage={addressData.message}
            addressData={addressData.data}
            cartData={cartData.data}
          />
        )}
      </Box>
    </>
  );
}

export default CheckoutPage;
