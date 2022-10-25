import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Checkout from '../../components/user/Checkout';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import {
  useGetAddressesQuery,
  useGetCartTotalQuery,
  useGetWalletBalanceQuery
} from '../../redux/api/userApiSlice';
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
  const {
    isLoading: isLoadingWallet,
    isFetching: isFetchingWallet,
    isSuccess: isSuccessWallet,
    isError: isErrorWallet,
    data: walletData,
    error: errorWallet
  } = useGetWalletBalanceQuery();
  const handleError = useApiErrorHandler();

  useEffect(() => {
    if (isErrorAddress) {
      handleError(errorAddress);
    }
    if (isErrorWallet) {
      handleError(errorWallet);
    }
  }, [isErrorAddress, errorAddress, handleError, isErrorWallet, errorWallet]);

  let content;
  if (
    isLoadingCart
    || (isFetchingCart && !isSuccessCart)
    || isLoadingAddress
    || (isFetchingAddress && !isSuccessAddress)
    || isLoadingWallet
    || (isFetchingWallet && !isSuccessWallet)
  ) {
    content = (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
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
   return (
      <>
        <HelmetMeta title="Checkout | Gamestop" />

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
            /imgs/cartisempty.webp"
            alt="YOUR CART IS EMPTY"
          />
          <Typography variant="h6">{error.data.message}</Typography>
          {error.data.message.includes('stock') || (
            <>
              <Typography sx={{ color: '#333333' }}>Add items to it now.</Typography>
              <PrimaryButton
                component={Link}
                to="/products?sort=recommended"
                sx={{ mt: 0 }}
              >
                Shop Now
              </PrimaryButton>
            </>
          )}
          {error.data.message.includes('stock') && (
            <>
              <Typography sx={{ color: '#333333' }}>Remove the items to checkout</Typography>
              <PrimaryButton
                component={Link}
                to="/cart"
                sx={{ mt: 0 }}
              >
                Go to cart
              </PrimaryButton>
            </>
          )}
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
            addressMessage={addressData?.message}
            addressData={addressData?.data}
            cartData={cartData?.data}
            walletBalance={walletData?.data?.balance}
          />
        )}
      </Box>
    </>
  );
}

export default CheckoutPage;
