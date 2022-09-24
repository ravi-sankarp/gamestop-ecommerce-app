import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import UserTableList from '../../components/admin/Table/UserTableList';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useGetUserDataQuery } from '../../redux/api/adminApiSlice';

function AdminUsersPage() {
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetUserDataQuery();
  const handleError = useApiErrorHandler();
  let content;
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
        <CircularProgress sx={{ overflow: 'hidden' }} color="primary" />
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
      <Typography variant="h5" sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}>
        USERS
      </Typography>
      {content}
      {isSuccess && <UserTableList data={data.data} />}
    </Box>
  );
}

export default AdminUsersPage;
