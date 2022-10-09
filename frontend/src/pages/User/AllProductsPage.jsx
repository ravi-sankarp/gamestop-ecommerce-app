import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import NoResultsFound from '../../components/NoResultsFound';
import MenuDrawer from '../../components/user/Drawer/MenuDrawer';
import ProductListCards from '../../components/user/Product/ProductListCards';
import ProductSort from '../../components/user/ProductSort';
import HelmetMeta from '../../components/HelmetMeta';
import { useGetAllProductsQuery } from '../../redux/api/viewsApiSlice';
import { setToast } from '../../redux/reducers/toastSlice';

function AllProductsPage() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { data, isLoading, isFetching, isError, isSuccess, error } = useGetAllProductsQuery(search);
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
    console.log({ error });
    content = error.message;
    dispatch(setToast({ open: true, data: error }));
  }

  const checkProductsExists = () => {
    if (data.data.length) {
      return <ProductListCards products={data.data} />;
    }
    return <NoResultsFound />;
  };
  return (
    <>
      <HelmetMeta title="Products | Gamestop" />
      <Box sx={{ overflowX: 'hidden', minHeight: '100vh', p: { xs: 1, md: 3, lg: 4 } }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, mt: 2, textAlign: 'center', fontWeight: '450' }}
        >
          SHOP
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'space-between' },
            height: '5rem',
            alignItems: 'center',
            mb: 3
          }}
        >
          <MenuDrawer />
          <ProductSort />
        </Box>
        {content}
        {isSuccess && checkProductsExists()}
      </Box>
    </>
  );
}

export default AllProductsPage;
