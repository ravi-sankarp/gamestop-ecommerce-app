import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useGetAllOrdersQuery } from '../../redux/api/adminApiSlice';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import OrderTable from '../../components/admin/Table/OrderTable';
import HelmetMeta from '../../components/HelmetMeta';

function AdminOrdersPage() {
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetAllOrdersQuery();
  let content;
  console.log(data);
  const handleError = useApiErrorHandler();
  if (isLoading || (isFetching && !isSuccess)) {
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

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);

  return (
    <>
      <HelmetMeta title="Admin All Orders | Gamestop" />
      <Box sx={{ overflowX: 'hidden', pt: 4 }}>
        <Typography
          variant="h5"
          sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
        >
          ORDERS
        </Typography>
        {content}
        {isSuccess && <OrderTable data={data.data} />}
      </Box>
    </>
  );
}

export default AdminOrdersPage;
