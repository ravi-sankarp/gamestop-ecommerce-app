import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import { useGetFeaturedProductsQuery } from '../../../redux/api/viewsApiSlice';
import ProductListCards from '../Product/ProductListCards';

function FeaturedProducts() {
  const { id } = useParams();
  const { data, isLoading,
    isFetching, isSuccess, isError, error } = useGetFeaturedProductsQuery(id);
  const handleError = useApiErrorHandler();

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);

  if (isLoading || isFetching) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '30vh',
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
  return (
    isSuccess && (
      <Box sx={{ py: 2 }}>
        <Typography
          variant="h5"
          textAlign="center"
          sx={{ my: 5 }}
        >
          TOP OFFERS
        </Typography>
        <ProductListCards
          products={data?.data}
          width={2}
        />
      </Box>
    )
  );
}

export default FeaturedProducts;
