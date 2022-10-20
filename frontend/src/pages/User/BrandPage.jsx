import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import HelmetMeta from '../../components/HelmetMeta';
import ProductListCards from '../../components/user/Product/ProductListCards';
import { useGetSingleBrandDataQuery } from '../../redux/api/viewsApiSlice';
import { setToast } from '../../redux/reducers/toastSlice';

function BrandPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isError, isSuccess, error } = useGetSingleBrandDataQuery({
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
    content = error.message;
    dispatch(setToast({ open: true, data: error }));
  }
  return (
    <>
      <HelmetMeta title={`${data?.data?.name ?? 'Brand Page'} | Gamestop`} />
      <Box sx={{ overflowX: 'hidden', minHeight: '100vh', p: { xs: 1, md: 3, lg: 4 } }}>
        {content}
        {isSuccess && (
          <>
            <Box
              component="img"
              src={data?.data?.brandDetails?.bannerImg?.imgUrl}
              sx={{ width: '100%', height: '30vh', mb: 4 }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                px: 20,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h4"
                sx={{ textTransform: 'uppercase' }}
              >
                {data?.data?.brandDetails?.name}
              </Typography>
              <Typography variant="subtitle1">{data?.data?.brandDetails?.description}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <Typography
                variant="h6"
                textALign="center"
              >
                OUR PRODUCTS
              </Typography>
            </Box>
            <ProductListCards products={data?.data?.products} />
          </>
        )}
      </Box>
    </>
  );
}

export default BrandPage;
