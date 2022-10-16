/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDeleteCouponMutation } from '../../../redux/api/adminApiSlice';

import useSuccessHandler from '../../../hooks/useSuccessHandler';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import EditCoupon from './EditCoupon';

export default function CouponTable({ coupons }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [couponData, setCouponData] = useState({});
  const [operation, setOperation] = useState('');
  const [deleteCoupon, { isLoading }] = useDeleteCouponMutation();
  const setSuccess = useSuccessHandler();
  const handleError = useApiErrorHandler();

  // for alert window
  const handleAlertShow = () => {
    setDialogOpen((current) => !current);
  };

  // open delete confirm dialog
  const handleAction = (proOffer, currentOperation) => {
    setCouponData(proOffer);
    setOperation(currentOperation);
    handleAlertShow();
  };

  // confirm delete
  const handleConfirmCategoryDelete = async () => {
    try {
      if (!isLoading) {
        const res = await deleteCoupon({ id: couponData._id }).unwrap();
        handleAlertShow();

        setSuccess(res);
      }
    } catch (err) {
      handleAlertShow();
      handleError(err);
    }
  };
  return (
    <>
      <Paper sx={{ mb: 5, mt: 4 }}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#2987de7a' }}>
              <TableRow>
                <TableCell align="center">Coupon Code</TableCell>
                <TableCell align="center">Discount</TableCell>
                <TableCell align="center">Minimum Purchase</TableCell>
                <TableCell align="center">Expiry Date</TableCell>
                <TableCell align="center">Actions </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow
                  key={coupon._id}
                  sx={{
                    p: 0,
                    '& td': {
                      p: { md: 1 }
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(even) ': { backgroundColor: '#f4f8fd' }
                  }}
                >
                  <TableCell
                    data-label="Coupon Code"
                    align="center"
                  >
                    {coupon.code}
                  </TableCell>
                  <TableCell
                    data-label="Discount"
                    align="center"
                  >
                    {coupon.discount}
                  </TableCell>
                  <TableCell
                    data-label="Minimum Price"
                    align="center"
                  >
                    {coupon.minPrice}
                  </TableCell>
                  <TableCell
                    data-label="Expiry Date"
                    align="center"
                  >
                    {new Date(coupon.expiryDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell
                    data-label="Actions"
                    align="center"
                  >
                    <IconButton
                      onClick={() => handleAction(coupon, 'edit')}
                      aria-label="edit"
                      color="primary"
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleAction(coupon, 'delete')}
                      aria-label="delete"
                      color="primary"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog
        open={dialogOpen}
        onClose={handleAlertShow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {operation === 'delete' ? (
          <>
            <DialogTitle id="alert-dialog-title">Confirm Delete </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <span>
                  Are you sure you want to delete the coupon
                  <Box
                    component="span"
                    sx={{ color: '#000', fontWeight: '800', textTransform: 'uppercase' }}
                  >
                    {couponData.code}
                  </Box>
                </span>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#339af0', '&:hover': { backgroundColor: '#1c7ed6' } }}
                onClick={handleAlertShow}
              >
                No
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#fa5252',
                  '&:hover': { backgroundColor: '#e03131' }
                }}
                onClick={handleConfirmCategoryDelete}
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>
              <div style={{ display: 'flex' }}>
                <Typography
                  variant="h6"
                  component="div"
                  style={{ flexGrow: 1 }}
                >
                  Edit Coupon
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
              <EditCoupon
                couponData={couponData}
                close={handleAlertShow}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
