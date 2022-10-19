import { useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import PaymentTableList from '../../components/admin/Table/PaymentTableList';
import { useGetAllPaymentsQuery } from '../../redux/api/adminApiSlice';
import PaymentFilter from '../../components/admin/Filters/PaymentFilter';

function AdminPaymentsPage() {
  const { search } = useLocation();
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetAllPaymentsQuery(search);
  let content;
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
    <Box sx={{ overflowX: 'hidden', pt: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
      >
        PAYMENTS
      </Typography>
      {content}
      {isSuccess && <PaymentFilter />}
      {isSuccess && <PaymentTableList data={data.data} />}
    </Box>
  );
}

export default AdminPaymentsPage;
