import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import ProductForm from '../../components/admin/Forms/Product/ProductForm';
import HelmetMeta from '../../components/HelmetMeta';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useGetNavlistQuery } from '../../redux/api/viewsApiSlice';

function AdminAddNewProductPage() {
  const { isLoading, isFetching, isSuccess, data, isError, error } = useGetNavlistQuery();
  const handleError = useApiErrorHandler();
  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);
  if (isLoading || (isFetching && !isSuccess)) {
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
      <HelmetMeta title="Add New Product | Gamestop" />

      <Box sx={{ backgroundColor: '#fff', p: 3, mx: { xs: 5, md: 30 } }}>
        <ProductForm
          categories={data?.categories}
          brands={data?.brands}
        />
      </Box>
    </Box>
  );
}

export default AdminAddNewProductPage;
