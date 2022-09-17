import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setToast } from '../../redux/reducers/toastSlice';
import { useGetBrandDataQuery } from '../../redux/api/adminApiSlice';
import BrandTableList from '../../components/admin/Table/BrandTableList';
import BrandForm from '../../components/admin/Forms/Brand/BrandForm';

function AdminBrandsPage() {
  const [openPopup, setOpenPopup] = useState(false);
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetBrandDataQuery();
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
  const handlePopupView = () => {
    setOpenPopup((current) => !current);
  };
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Typography variant="h5" sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}>
        Brand List
      </Typography>
      {content}
      {isSuccess && (
        <>
          <Button onClick={handlePopupView} sx={{ mt: 5 }} variant="contained" color="success">
            Add Brand
          </Button>
          <BrandTableList data={data.data} />
          <Dialog sx={{ height: '100vh' }} onClose={handlePopupView} open={openPopup} maxWidth="md">
            <DialogTitle>
              <div style={{ display: 'flex' }}>
                <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                  Add Brand
                </Typography>
                <Button color="primary" variant="outlined" onClick={handlePopupView}>
                  <CloseOutlinedIcon />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <BrandForm data={data.data} close={handlePopupView} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default AdminBrandsPage;
