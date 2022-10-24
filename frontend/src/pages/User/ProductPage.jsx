import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HelmetMeta from '../../components/HelmetMeta';
import ProductDescriptionTab from '../../components/user/Product/ProductDesctiptionTab';
import ProductReview from '../../components/user/Product/ProductReview';
import SimilarProducts from '../../components/user/Product/SimilarProducts';
import SingleProduct from '../../components/user/Product/SingleProduct';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useGetSingleProductQuery } from '../../redux/api/viewsApiSlice';

function ProductPage() {
  const { id } = useParams();
  const apiErrorHandler = useApiErrorHandler();
  const { data, isLoading, isFetching, isError, isSuccess, error } = useGetSingleProductQuery({
    id
  });

  useEffect(() => {
    if (isError) {
      apiErrorHandler(error);
    }
  }, [isError]);

  if (isLoading || isFetching) {
    return (
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

  return (
    <>
      <HelmetMeta title={`${data?.data?.name ?? 'Product'} | Gamestop`} />
      <Box sx={{ overflowX: 'hidden', minHeight: '100vh', p: { xs: 1, md: 3, lg: 4 } }}>
        {isSuccess && (
          <>
            <SingleProduct product={data.data} />
            <ProductDescriptionTab description={data.data.description} />
            <SimilarProducts />
            <ProductReview />
          </>
        )}
      </Box>
    </>
  );
}

export default ProductPage;
