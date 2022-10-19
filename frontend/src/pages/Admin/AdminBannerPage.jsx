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
import { useGetBannerDataQuery } from '../../redux/api/adminApiSlice';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import AddNewBanner from '../../components/admin/Banners/AddNewBanner';
import BannerTable from '../../components/admin/Banners/BannerTable';

function AdminBannerPage() {
  const [openPopup, setOpenPopup] = useState(false);
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetBannerDataQuery();
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
  const handlePopupView = () => {
    setOpenPopup((current) => !current);
  };
  return (
    <Box sx={{ overflowX: 'hidden', pt: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
      >
        BANNERS
      </Typography>
      {content}
      {isSuccess && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<AddBoxIcon />}
              onClick={handlePopupView}
              sx={{ mr: { xs: 3, md: 25 }, maxWidth: 200, backgroundColor: '#fff' }}
            >
              Add Banner
            </Button>
          </Box>
          {!!data?.data?.length && <BannerTable data={data.data} />}
          {!!data?.data?.length || (
            <Box
              sx={{
                width: '100%',
                mt: 15,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography>You have not added any banners !</Typography>
              <Typography>Add one to see it here</Typography>
            </Box>
          )}
          <Dialog
            sx={{ height: '100vh', minWidth: '30vw' }}
            onClose={handlePopupView}
            open={openPopup}
          >
            <DialogTitle>
              <div style={{ display: 'flex' }}>
                <Typography
                  variant="h6"
                  component="div"
                  style={{ flexGrow: 1 }}
                >
                  Add Banner
                </Typography>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={handlePopupView}
                >
                  <CloseOutlinedIcon />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <AddNewBanner close={handlePopupView} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default AdminBannerPage;
