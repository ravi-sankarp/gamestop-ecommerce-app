/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import useSuccessHandler from '../../../hooks/useSuccessHandler';
import { useChangeOrderStatusMutation } from '../../../redux/api/adminApiSlice';

function OrderTable({ data }) {
  const [changeOrderStatus, { isLoading: isLoadingChangeOrderStatus }] =
    useChangeOrderStatusMutation();
  const [status, setStatus] = useState();
  const [error, setError] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [changeOrderDetails, setChangeOrderDetails] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successToast = useSuccessHandler();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleDrawer = () => {
    setDrawerOpen((current) => !current);
  };

  const handleChangeOrderStatus = (order, _status) => {
    setChangeOrderDetails(order);
    setStatus(_status);
    toggleDrawer();
  };

  const handleSelectChange = (e) => {
    setStatus(e.target.value);
  };
  const handleConfirmOrderStatusChange = async () => {
    if (!status) {
      setError('Please select a status');
      return;
    }
    try {
      if (!isLoadingChangeOrderStatus) {
        const res = await changeOrderStatus({
          orderId: changeOrderDetails.orderId,
          status
        }).unwrap();
        setError('');
        toggleDrawer();
        successToast(res);
      }
    } catch (err) {
      console.error(err);
      setError(err.data.message);
    }
  };

  return (
    <>
      <Box sx={{ overflowX: 'hidden', pt: 4 }}>
        {data && (
          <Paper sx={{ mb: 5 }}>
            <TableContainer>
              <Table
                aria-label="simple table"
                sx={{ minHeight: '40vh' }}
              >
                <TableHead sx={{ backgroundColor: '#2987de7a' }}>
                  <TableRow>
                    <TableCell
                      sx={{ width: '40px' }}
                      align="center"
                    >
                      Index
                    </TableCell>
                    <TableCell align="center">Product Name</TableCell>
                    <TableCell align="center">Ordered Date</TableCell>
                    <TableCell align="center">Total Price</TableCell>
                    <TableCell align="center">Payment Method</TableCell>
                    <TableCell align="center">Delivery Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order, i) => (
                      <TableRow
                        key={order.orderId}
                        sx={{
                          p: 0,
                          '& td': {
                            p: { md: 0 }
                          },
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:nth-of-type(even) ': { backgroundColor: '#f4f8fd' }
                        }}
                      >
                        <TableCell
                          data-label="Index"
                          align="center"
                        >
                          {i + 1}
                        </TableCell>
                        <TableCell
                          data-label="Product Name"
                          align="center"
                        >
                          {order?.item?.productName}
                          {order?.items?.map((item) => (
                            <span>{item.productName}</span>
                          ))}
                        </TableCell>
                        <TableCell
                          data-label="Ordered Date"
                          align="center"
                        >
                          {new Date(order.orderedOn).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell
                          data-label="Total Price"
                          align="center"
                        >
                          {`₹ ${order.totalAmount.toLocaleString()}`}
                        </TableCell>
                        <TableCell
                          data-label="Payment Method"
                          align="center"
                        >
                          {order.paymentMethod}
                        </TableCell>
                        <TableCell
                          data-label="Order Status"
                          align="center"
                        >
                          {order.orderStatus === 'Cancelled' ? (
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-block',
                                width: '4px',
                                mr: 1,
                                height: '4px',
                                backgroundColor: '#ff6161',
                                borderRadius: '50%',
                                border: '2px solid #ff6161'
                              }}
                            />
                          ) : (
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-block',
                                width: '4px',
                                mr: 1,
                                height: '4px',
                                backgroundColor: '#26a541',
                                borderRadius: '50%',
                                border: '2px solid #26a541'
                              }}
                            />
                          )}

                          {`${order.orderStatus} on 
                          ${new Date(order.orderStatusUpdatedOn).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })} `}
                        </TableCell>
                        <TableCell
                          data-label="Actions"
                          align="center"
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              justifyContent: { xs: 'flex-end', md: 'center' },
                              '& p': {
                                fontSize: 15,
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              },
                              '& p:hover': {
                                color: '#1a6aed'
                              }
                            }}
                          >
                            {order.orderStatus === 'Delivered' ||
                              order.orderStatus.includes('Cancelled') ||
                              order.orderStatus === 'Returned' || (
                                <Typography
                                  sx={{
                                    mt: 0,
                                    mb: 0,
                                    height: 30,
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      color: '#1a6aed'
                                    }
                                  }}
                                  onClick={() => handleChangeOrderStatus(order, order.orderStatus)}
                                  variant="outlined"
                                >
                                  Change Status
                                </Typography>
                              )}
                            {(order.orderStatus === 'Delivered' ||
                              order.orderStatus.includes('Cancelled') ||
                              order.orderStatus === 'Returned') && (
                              <Typography
                                sx={{
                                  mt: 0,
                                  mb: 0,
                                  height: 30,
                                  textTransform: 'none',
                                  color: '#808080'
                                }}
                                variant="outlined"
                              >
                                Change Status
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Box>
      <Dialog
        open={drawerOpen}
        onClose={setDrawerOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Change Order Status </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              color: '#000'
            }}
            id="alert-dialog-description"
          >
            <Typography>
              Select the status for the order for the product
              {' '}
              {changeOrderDetails?.item?.productName}
              {changeOrderDetails?.items?.map((item) => (
                <Typography component="span">{`${item.productName},`}</Typography>
              ))}
            </Typography>
            <TextField
              sx={{ mb: 2 }}
              label="Select Status"
              select
              fullWidth
              required
              value={status ?? ''}
              onChange={handleSelectChange}
              name="categoryId"
              type="text"
            >
              <MenuItem
                selected
                value="Order Dispatched"
              >
                Order Dispatched
              </MenuItem>
              <MenuItem
                selected
                value="Order Shipped"
              >
                Order Shipped
              </MenuItem>
              <MenuItem
                selected
                value="Out For Delivery"
              >
                Out For Delivery
              </MenuItem>
              <MenuItem
                selected
                value="Delivered"
              >
                Delivered
              </MenuItem>
              <MenuItem
                selected
                value="Cancelled By Admin"
              >
                Cancel
              </MenuItem>
            </TextField>
            {error && <Alert severity="error">{error}</Alert>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#339af0', '&:hover': { backgroundColor: '#1c7ed6' } }}
            onClick={toggleDrawer}
          >
            No
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#fa5252',
              '&:hover': { backgroundColor: '#e03131' }
            }}
            onClick={handleConfirmOrderStatusChange}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default OrderTable;
