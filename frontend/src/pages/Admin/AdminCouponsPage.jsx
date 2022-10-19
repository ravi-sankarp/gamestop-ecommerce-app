/* eslint-disable operator-linebreak */
import { useState, useEffect } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import HelmetMeta from '../../components/HelmetMeta';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useGetAllCouponsQuery } from '../../redux/api/adminApiSlice';
import AddNewCouponForm from '../../components/admin/Coupons/AddNewCoupon';
import CouponTable from '../../components/admin/Coupons/CouponTable';

function AdminCouponsPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetAllCouponsQuery();

  let content;
  const handleError = useApiErrorHandler();
  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);

  if (isLoading || (isFetching && !isSuccess)) {
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

  const handleAlertShow = () => {
    setOpen((current) => !current);
  };

  return (
    <>
      <HelmetMeta title="Admin Coupons Page | Gamestop" />
      <Box sx={{ overflowX: 'hidden', pt: 4 }}>
        <Typography
          variant="h5"
          sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
        >
          COUPONS
        </Typography>
        {content}
        {!data?.data?.length && (
          <Box>
            <Typography>You have not added any coupons till now</Typography>
          </Box>
        )}
        <Button
          startIcon={<AddBoxIcon />}
          variant="outlined"
          onClick={() => handleAlertShow()}
          sx={{
            position: 'absolute',
            right: { xs: 16, md: 175 },
            mt: 4,
            py: 1,
            backgroundColor: '#fff'
          }}
        >
          Add Coupon
        </Button>
        <Box>{!!data?.data?.length && <CouponTable coupons={data?.data} />}</Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleAlertShow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          minWidth: '40vw'
        }}
      >
        <DialogTitle>
          <div style={{ display: 'flex' }}>
            <Typography
              variant="h6"
              component="div"
              style={{ flexGrow: 1 }}
            >
              Add Coupon
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleAlertShow}
            >
              <CloseOutlinedIcon />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <AddNewCouponForm close={handleAlertShow} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminCouponsPage;
