/* eslint-disable no-nested-ternary */
/* eslint-disable operator-linebreak */
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCallback, useEffect, useState } from 'react';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import useSuccessHandler from '../../../hooks/useSuccessHandler';
import {
  useCancelOrderMutation,
  useGetInvoiceQuery,
  useReturnOrderMutation
} from '../../../redux/api/userApiSlice';
import OrderPriceDetails from './OrderPriceDetails';

function OrderTable({ items, order, admin }) {
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const [skip, setSkip] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [requestName, setRequestName] = useState(false);
  const {
    // eslint-disable-next-line no-unused-vars
    data: invoiceData,
    isFetching: isFetchingInvoice,
    isLoading: isLoadingInvoice,
    isSuccess: isSuccessInvoice,
    isError: isErrorInvoice,
    error: errorInvoice
  } = useGetInvoiceQuery(
    { id: orderDetails?.orderId ?? '' },
    {
      skip
    }
  );
  const successToast = useSuccessHandler();
  const errorToast = useApiErrorHandler();
  const [cancelOrder, { isLoading: isLoadingCancelOrder }] = useCancelOrderMutation();
  const [returnOrder, { isLoading: isLoadingReturnOrder }] = useReturnOrderMutation();

  useEffect(() => {
    if (isErrorInvoice) {
      errorToast(errorInvoice);
    }
  }, [isErrorInvoice, errorInvoice, errorToast]);

  useEffect(() => {
    if (isLoadingInvoice || isFetchingInvoice) {
      const toast = {
        status: 'success',
        message: 'Downloading invoice...'
      };
      successToast(toast);
    }
  }, [successToast, isLoadingInvoice, isFetchingInvoice]);

  useEffect(() => {
    if (isSuccessInvoice) {
      setSkip(true);
    }
  }, [isSuccessInvoice, successToast]);

  const toggleDrawer = () => {
    setDrawerOpen((current) => !current);
  };

  const handleCancelRequest = async (details) => {
    setRequestName('cancel');
    setOrderDetails(details);
    toggleDrawer();
  };

  const handleReturnRequest = async (details) => {
    setRequestName('return');
    setOrderDetails(details);
    toggleDrawer();
  };

  const handleGetInvoice = (details) => {
    setOrderDetails(details);
    setSkip(false);
  };

  const handleConfirmCancel = async () => {
    try {
      if (!isLoadingCancelOrder) {
        const res = await cancelOrder({
          orderId: orderDetails.orderId,
          productId: orderDetails.productId
        }).unwrap();
        toggleDrawer();
        successToast(res);
      }
    } catch (err) {
      errorToast(err);
    }
  };
  const handleConfirmReturn = async () => {
    try {
      if (!isLoadingReturnOrder) {
        const res = await returnOrder({
          orderId: orderDetails.orderId,
          productId: orderDetails.productId
        }).unwrap();
        toggleDrawer();
        successToast(res);
      }
    } catch (err) {
      errorToast(err);
    }
  };
  const calcDayDifference = useCallback((orderedDate) => {
    const orderedTimeStamp = new Date(orderedDate).getTime();
    const todayTimeStamp = new Date().getTime();
    const differenceInTime = todayTimeStamp - orderedTimeStamp;
    const dayDifference = differenceInTime / (1000 * 3600 * 24);
    if (dayDifference > 7) {
      return false;
    }
    return true;
  }, []);
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
        <Typography>{open ? 'Hide Details' : 'Show Details'}</Typography>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
          sx={{ color: '#000' }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <Box sx={{ margin: 1 }}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
          >
            Order Details
          </Typography>
          <Table
            size="small"
            aria-label="purchases"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Product Name</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Subtotal</TableCell>
                <TableCell align="center">Order Status</TableCell>
               {admin || <TableCell align="center">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length &&
                items?.map((item) => (
                  <TableRow key={item.productName}>
                    <TableCell
                      data-label="#"
                      align="center"
                    >
                      <img
                        src={item.imgUrl}
                        alt={item.productName}
                        width="50px"
                      />
                    </TableCell>
                    <TableCell
                      data-label="Product Name"
                      align="center"
                    >
                      {item.productName}
                    </TableCell>
                    <TableCell
                      data-label="Price"
                      align="center"
                    >
                      {`₹ ${item?.originalPrice?.toLocaleString()}`}
                    </TableCell>
                    <TableCell
                      data-label="Quantity"
                      align="center"
                    >
                      {item.count}
                    </TableCell>
                    <TableCell
                      data-label="Subtotal"
                      align="center"
                    >
                      {`₹ ${item.subTotal.toLocaleString()}`}
                    </TableCell>
                    <TableCell
                      data-label="Order Status"
                      align="center"
                    >
                      {order.orderStatus.includes('Cancelled') ||
                      order.orderStatus.includes('Returned') ||
                      item.returned ||
                      item.cancelled ? (
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
                      {item.retured
                        ? 'Item Returned'
                        : item.cancelled
                        ? 'Item Cancelled'
                        : order.orderStatus}
                    </TableCell>
                    {admin || (
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
                          order.orderStatus === 'Returned' ||
                          item.returned ||
                          item.cancelled || (
                            <Typography
                              onClick={() => handleCancelRequest({
                                  orderId: order.orderId,
                                  productId: item.productId,
                                  productName: item.productName
                                })}
                            >
                              Cancel Order
                            </Typography>
                          )}
                        {order.orderStatus === 'Delivered' && (
                          <>
                            <Typography onClick={() => handleGetInvoice(order)}>
                              Get Invoice
                            </Typography>
                            {calcDayDifference(order.orderStatusUpdatedOn) && (
                              <Typography
                                onClick={() => handleReturnRequest({
                                    orderId: order.orderId,
                                    productId: item.productId,
                                    productName: item.productName
                                  })}
                              >
                                Return Product
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
</TableCell>
)}
                  </TableRow>
                ))}
              {!!items.length || (
                <TableRow>
                  <TableCell
                    data-label="#"
                    align="center"
                  >
                    <img
                      src={items.imgUrl}
                      alt={items.productName}
                      width="50px"
                    />
                  </TableCell>
                  <TableCell
                    data-label="Product Name"
                    align="center"
                  >
                    {items.productName}
                  </TableCell>
                  <TableCell
                    data-label="Price"
                    align="center"
                  >
                    {`₹ ${items?.originalPrice?.toLocaleString()}`}
                  </TableCell>
                  <TableCell
                    data-label="Quantity"
                    align="center"
                  >
                    {items.count}
                  </TableCell>
                  <TableCell
                    data-label="Subtotal"
                    align="center"
                  >
                    {`₹ ${items?.subTotal?.toLocaleString()}`}
                  </TableCell>
                  <TableCell
                    data-label="Order Status"
                    align="center"
                  >
                    {order.orderStatus.includes('Cancelled') ||
                    order.orderStatus.includes('Returned') ? (
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
                    {order.orderStatus}
                  </TableCell>
                  {admin || (
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
                            onClick={() => handleCancelRequest({
                                orderId: order.orderId,
                                productId: order.item.productId,
                                productName: order.item.productName
                              })}
                          >
                            Cancel Order
                          </Typography>
                        )}
                      {order.orderStatus === 'Delivered' && (
                        <>
                          <Typography onClick={() => handleGetInvoice(order)}>
                            Get Invoice
                          </Typography>
                          {calcDayDifference(order.orderStatusUpdatedOn) && (
                            <Typography
                              onClick={() => handleReturnRequest({
                                  orderId: order.orderId,
                                  productId: order.item.productId,
                                  productName: order.item.productName
                                })}
                            >
                              Return Product
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
</TableCell>
)}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'space-between',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h6"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Payment Method
                </Typography>
                <Typography sx={{ pl: 1 }}>{order.paymentMethod}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
                <Typography variant="h6">Delivery Address</Typography>
                <Box sx={{ display: 'flex', gap: 1, pl: 1 }}>
                  <Typography>{order.deliveryAddress.name}</Typography>
                  <Typography>{order.deliveryAddress.phoneNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, whiteSpace: 'nowrap', pl: 1 }}>
                  <Typography>{`${order.deliveryAddress.houseName},`}</Typography>
                  <Typography>{`${order.deliveryAddress.streetName},`}</Typography>
                  <Typography>{`${order.deliveryAddress.city},`}</Typography>
                  <Typography>{`${order.deliveryAddress.district},`}</Typography>
                  <Typography>{`${order.deliveryAddress.state} -`}</Typography>
                  <Typography>{order.deliveryAddress.pincode}</Typography>
                </Box>
              </Box>
            </Box>
            <OrderPriceDetails order={order} />
          </Box>
        </Box>
      </Collapse>
      <Dialog
        open={drawerOpen}
        onClose={setDrawerOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {` Confirm
          ${requestName}
          Request`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {requestName === 'cancel'
              ? 'Are you sure you want to cancel the order for the product'
              : 'Are you sure you want to return the product'}
            {` ${orderDetails?.productName}`}
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
            onClick={requestName === 'cancel' ? handleConfirmCancel : handleConfirmReturn}
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
