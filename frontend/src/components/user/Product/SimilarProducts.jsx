import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import { useGetSimilarProductsQuery } from '../../../redux/api/viewsApiSlice';
import ProductListCards from './ProductListCards';

function SimilarProducts() {
  const { id } = useParams();
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetSimilarProductsQuery(id);
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
      <Box sx={{ border: '1px solid #f0f0f0', py: 2 }}>
        <Typography
          variant="h5"
          textAlign="center"
          sx={{ mb: 5 }}
        >
          SIMILAR PRODUCTS
        </Typography>
        <ProductListCards products={data?.data} />
      </Box>
    )
  );
}

export default SimilarProducts;
