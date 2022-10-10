import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductEditForm from '../../components/admin/Forms/Product/ProductEditForm';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useGetNavlistQuery, useGetSingleProductQuery } from '../../redux/api/viewsApiSlice';

function AdminEditProductPage() {
  const { id } = useParams();
  const { isLoading, isFetching, isSuccess, data, isError, error } = useGetNavlistQuery();
  const {
    data: productData,
    isLoading: isLoadingProductData,
    isFetching: isFetchingProductData,
    isError: isErrorProductData,
    isSuccess: isSuccessProductData,
    error: errorProductData
  } = useGetSingleProductQuery({
    id
  });
  const handleError = useApiErrorHandler();
  useEffect(() => {
    if (isError) {
      handleError(error);
    }
    if (isErrorProductData) {
      handleError(errorProductData);
    }
  }, [isError, error, handleError, isErrorProductData, errorProductData]);
  if (
    isLoading
    || (isFetching && !isSuccess)
    || isLoadingProductData
    || (isFetchingProductData && !isSuccessProductData)
  ) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
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
    <Box sx={{ my: 4 }}>
      <Box sx={{ backgroundColor: '#fff', p: 3, mx: { xs: 5, md: 30 } }}>
        <ProductEditForm
          categories={data?.categories}
          brands={data?.brands}
          product={productData.data}
        />
      </Box>
    </Box>
  );
}

export default AdminEditProductPage;
