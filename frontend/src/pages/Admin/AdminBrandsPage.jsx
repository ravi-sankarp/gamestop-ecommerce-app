import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useEffect, useState } from 'react';
import { useGetBrandDataQuery } from '../../redux/api/adminApiSlice';
import BrandTableList from '../../components/admin/Table/BrandTableList';
import BrandForm from '../../components/admin/Forms/Brand/BrandForm';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';

function AdminBrandsPage() {
  const [openPopup, setOpenPopup] = useState(false);
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetBrandDataQuery();
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
        <CircularProgress sx={{ overflow: 'hidden' }} color="primary" />
      </Box>
    );
  }

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);
  const handlePopupView = () => {
    setOpenPopup((current) => !current);
  };
  return (
    <Box sx={{ overflowX: 'hidden', pt: 4 }}>
      <Typography variant="h5" sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}>
        BRANDS
      </Typography>
      {content}
      {isSuccess && (
        <>
          <Button
            variant="outlined"
            startIcon={<AddBoxIcon />}
            onClick={handlePopupView}
            sx={{ mt: 5, position: 'absolute', right: 16, display: 'flex' }}
          >
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
