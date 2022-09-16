import { Box, CircularProgress, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import ProductTableList from '../../components/admin/Table/ProductTableList';
import { useGetUserDataQuery } from '../../redux/api/adminApiSlice';
import { setToast } from '../../redux/reducers/toastSlice';

function AdminUsersPage() {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetUserDataQuery();
  let content;
  if (isLoading || (isFetching && !isSuccess)) {
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
    <Box sx={{ overflowX: 'hidden' }}>
      <Typography variant="h5" sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}>
        Users List
      </Typography>
      {content}
      {isSuccess && <ProductTableList data={data.data} />}
    </Box>
  );
}

export default AdminUsersPage;
