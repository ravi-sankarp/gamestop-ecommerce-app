/* eslint-disable no-unused-vars */
import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import ProductListCards from '../../components/user/ProductListCards';
import { useGetAllProductsQuery } from '../../redux/api/viewsApiSlice';
import { setToast } from '../../redux/reducers/toastSlice';

function AllProductsPage() {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isError, isSuccess, error } = useGetAllProductsQuery();
  let content;
  if (isLoading || isFetching) {
    content = (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <CircularProgress sx={{ overflow: 'hidden' }} color="primary" />
      </Box>
    );
  }
  if (isError) {
    console.log(error);
    content = null;
    dispatch(setToast({ open: true, data: error }));
  }
  return (
    <Box sx={{ overflowX: 'hidden', minHeight: '100vh', p: { xs: 1, md: 3, lg: 4 } }}>
      <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', fontWeight: '450' }}>
        Products
      </Typography>
      {content}
      {isSuccess && <ProductListCards products={data.data} />}
    </Box>
  );
}

export default AllProductsPage;
