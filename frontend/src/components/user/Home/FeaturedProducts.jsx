import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import { useGetFeaturedProductsQuery } from '../../../redux/api/viewsApiSlice';
import ProductListCards from '../Product/ProductListCards';
import CardLoadingHome from './CardLoadingHome';

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
    return <CardLoadingHome width={2} />;
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
