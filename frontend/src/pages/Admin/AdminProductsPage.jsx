import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ProductTableList from '../../components/admin/Table/ProductTableList';
import { useGetProductDataQuery } from '../../redux/api/adminApiSlice';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';

function AdminProductsPage() {
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetProductDataQuery();
  let content;
  const handleError = useApiErrorHandler();

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);

  if (isLoading || (isFetching && !isSuccess)) {
    content = (
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
    <Box sx={{ overflowX: 'hidden', pt: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
      >
        PRODUCTS
      </Typography>
      {content}
      {isSuccess && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<AddBoxIcon />}
              component={Link}
              to="/admin/addnewproduct"
              sx={{
                mr: { xs: 3, md: 30 },
                mt: 5,
                maxWidth: 200,
                backgroundColor: '#343a40'
              }}
              variant="contained"
            >
              Add Product
            </Button>
          </Box>
          <ProductTableList
            data={data.data.products}
            categories={data.data.categories}
            brands={data.data.brands}
          />
        </>
      )}
    </Box>
  );
}

export default AdminProductsPage;
