import { Box, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import SingleProduct from '../../components/user/SingleProduct';
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
      {content}
      {isSuccess && <SingleProduct product={data.data} />}
    </Box>
  );
}

export default ProductPage;
