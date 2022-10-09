import { Box, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import HelmetMeta from '../../components/HelmetMeta';
import SingleProduct from '../../components/user/Product/SingleProduct';
import { useGetSingleProductQuery } from '../../redux/api/viewsApiSlice';
import { setToast } from '../../redux/reducers/toastSlice';

function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isError, isSuccess, error } = useGetSingleProductQuery({
    id
  });
  let content;
  if (isLoading || isFetching) {
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
  if (isError) {
    console.log(error);
    content = error.message;
    dispatch(setToast({ open: true, data: error }));
  }
  return (
    <>
      <HelmetMeta title={`${data?.data?.name ?? 'Product'} | Gamestop`} />
      <Box sx={{ overflowX: 'hidden', minHeight: '100vh', p: { xs: 1, md: 3, lg: 4 } }}>
        {content}
        {isSuccess && <SingleProduct product={data.data} />}
      </Box>
    </>
  );
}

export default ProductPage;
