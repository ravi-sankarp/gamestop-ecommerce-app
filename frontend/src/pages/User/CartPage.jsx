import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useGetCartDetailsQuery } from '../../redux/api/userApiSlice';
import { PrimaryButton } from '../../MaterialUiConfig/styled';
import CartList from '../../components/user/Cart/CartList';
import HelmetMeta from '../../components/HelmetMeta';

function CartPage() {
  const { data, isFetching, isLoading, isSuccess, isError, error } = useGetCartDetailsQuery();
  const handleError = useApiErrorHandler();
  let content;
  if (isLoading || (isFetching && !isSuccess)) {
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
  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);
  return (
    <>
      <HelmetMeta title="Shopping Cart | Gamestop" />
      <Box sx={{ overflowX: 'hidden', pt: 4, backgroundColor: '#f1f3f6', minHeight: '90vh' }}>
        <Typography
          variant="h4"
          sx={{ mb: '2rem', textAlign: 'center' }}
        >
          CART
        </Typography>
        {content}
        {data?.message && (
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
            <Typography variant="h6">{data.message}</Typography>
            <Typography sx={{ color: '#333333' }}>Add items to it now.</Typography>
            <PrimaryButton
              component={Link}
              to="/products?sort=recommended"
              sx={{ mt: 0 }}
            >
              Shop Now
            </PrimaryButton>
          </Box>
        )}
        {data?.data && <CartList data={data.data} />}
      </Box>
    </>
  );
}

export default CartPage;
