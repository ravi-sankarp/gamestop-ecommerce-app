import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import HelmetMeta from '../../components/HelmetMeta';
import ProductListCards from '../../components/user/Product/ProductListCards';
import { useGetSingleCategoryDataQuery } from '../../redux/api/viewsApiSlice';
import { setToast } from '../../redux/reducers/toastSlice';

function CategoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isError, isSuccess, error } = useGetSingleCategoryDataQuery({
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
      <HelmetMeta title={`${data?.data?.name ?? 'Category Page'} | Gamestop`} />
      <Box sx={{ overflowX: 'hidden', minHeight: '100vh', p: { xs: 1, md: 3, lg: 4 } }}>
        {content}
        {isSuccess && (
          <>
            <Box
              component="img"
              src={data?.data?.categoryDetails?.bannerImg?.imgUrl}
              sx={{
                width: '100%',
                height: '30vh',
                mb: 4,
                objectFit: { xs: 'cover', md: 'contain' }
              }}
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
                {data?.data?.categoryDetails?.name}
              </Typography>
              <Typography variant="subtitle1">
                {data?.data?.categoryDetails?.description}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <Typography
                variant="h6"
                textALign="center"
              >
                PRODUCTS
              </Typography>
            </Box>
            <ProductListCards products={data?.data?.products} />
          </>
        )}
      </Box>
    </>
  );
}

export default CategoryPage;
