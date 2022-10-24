/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { useChangeOrderStatusMutation, useGetAllOrdersQuery } from '../../redux/api/adminApiSlice';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import HelmetMeta from '../../components/HelmetMeta';
import OrderFilter from '../../components/admin/Filters/OrderFilter';
import NoResultsFound from '../../components/NoResultsFound';
import OrderTable from '../../components/user/Orders/OrderTable';
import useSuccessHandler from '../../hooks/useSuccessHandler';
import { SecondaryButton } from '../../MaterialUiConfig/styled';
import DashboardCard from '../../components/admin/DashboardCard';

function AdminOrdersPage() {
  const { search: params } = useLocation();
  const [resData, setResData] = useState([]);
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetAllOrdersQuery(params);
  const [changeOrderStatus, {
     isLoading: isLoadingChangeOrderStatus }] = useChangeOrderStatusMutation();
  const [status, setStatus] = useState();
  const [selectError, setSelectError] = useState();

  const [changeOrderDetails, setChangeOrderDetails] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successToast = useSuccessHandler();
  let content;
  const handleError = useApiErrorHandler();

  useEffect(() => {
    if (isSuccess) {
      if (data?.data?.orders?.length) {
        setResData(data.data.orders);
      }
    }
  }, [data]);

  if (isLoading || (isFetching && !isSuccess)) {
    content = (
      <Box
        sx={{
          width: '100%',
          height: '50vh',
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
      setSelectError('Please select a status');
      return;
    }
    try {
      if (!isLoadingChangeOrderStatus) {
        const res = await changeOrderStatus({
          orderId: changeOrderDetails.orderId,
          status
        }).unwrap();
        setSelectError('');
        toggleDrawer();
        successToast(res);
      }
    } catch (err) {
      setSelectError(err.data.message);
    }
  };

  return (
    <>
      <HelmetMeta title="Admin All Orders | Gamestop" />
      <Box sx={{ overflowX: 'hidden', pt: 4, p: 1 }}>
        <Typography
          variant="h5"
          sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
        >
          ORDERS
        </Typography>
        {isSuccess && (
          <Box sx={{ display: 'flex', mt: 3, mb: 3, justifyContent: 'space-between' }}>
            <DashboardCard
              title="Total Orders"
              value={data?.data?.count?.reduce((acc, item) => acc + item.totalOrders, 0)}
            />
            <DashboardCard
              title="Placed Orders"
              value={data?.data?.count?.reduce(
                (acc, item) => (item._id === 'Order Placed' ? acc + item.totalOrders : acc + 0),
                0
              )}
            />
            <DashboardCard
              title="Delivered Orders"
              value={data?.data?.count?.reduce(
                (acc, item) => (item._id === 'Delivered' ? acc + item.totalOrders : acc + 0),
                0
              )}
            />
            <DashboardCard
              title="Cancelled Orders"
              value={data?.data?.count?.reduce(
                (acc, item) => (item._id.includes('Cancelled') ? acc + item.totalOrders : acc + 0),
                0
              )}
            />
          </Box>
        )}
        {isSuccess && <OrderFilter />}
        {isSuccess && resData.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              alignItems: 'center',
              minHeight: '40vh',
              my: 4
            }}
          >
            {resData?.map((order, index) => (
              <Box
                key={order.orderId}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  width: { md: '80vw' },
                  p: 2,
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 0px',
                  border: '1px solid #dbdbdb',
                  borderRadius: '2px',
                  '&:hover': {
                    boxShadow: '0 1px 12px 2px #dbdbdb',
                    transition: 'box-shadow 100ms linear'
                  }
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    width: '95%',
                    justifyContent: 'space-between',
                    gap: 5,
                    alignItems: 'flex-start',
                    p: 2
                  }}
                >
                  <Typography
                    textAlign="center"
                    sx={{ mt: 'auto' }}
                  >
                    {index + 1}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography
                      textAlign="center"
                      sx={{ color: '#868e96', fontSize: 12 }}
                    >
                      {order.items ? 'Products Name' : 'Product Name'}
                    </Typography>
                    <Typography>{order?.item?.productName}</Typography>
                    {order?.items?.map((item) => (
                      <Typography>{item.productName}</Typography>
                    ))}
                  </Box>
                  <Box>
                    <Typography
                      textAlign="center"
                      sx={{ color: '#868e96', fontSize: 12 }}
                    >
                      Order Status
                    </Typography>
                    {order.orderStatus.includes('Cancelled')
                    || order.orderStatus.includes('Retured') ? (
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
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#868e96', fontSize: 12, whiteSpace: 'nowrap' }}>
                      Total Amount
                    </Typography>
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      {`₹ ${order?.totalAmountDiscountedOriginal.toLocaleString()}`}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Typography sx={{ color: '#868e96', fontSize: 12, whiteSpace: 'nowrap' }}>
                      Action
                    </Typography>
                    {order.orderStatus === 'Delivered'
                      || order.orderStatus.includes('Cancelled')
                      || order.orderStatus === 'Returned' || (
                        <SecondaryButton
                          sx={{
                            mt: 0,
                            mb: 0,
                            py: 0,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                          onClick={() => handleChangeOrderStatus(order, order.orderStatus)}
                          variant="outlined"
                        >
                          Change Status
                        </SecondaryButton>
                      )}
                    {(order.orderStatus === 'Delivered'
                      || order.orderStatus.includes('Cancelled')
                      || order.orderStatus === 'Returned') && (
                      <SecondaryButton
                        disabled
                        sx={{
                          mt: 0,
                          mb: 0,
                          py: 0,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Change Status
                      </SecondaryButton>
                    )}
                  </Box>
                </Box>
                <OrderTable
                  admin
                  key={order.orderedOn}
                  order={order}
                  items={order.items ?? order.item}
                />
              </Box>
            ))}
          </Box>
        )}
        {content}
        {isSuccess && !data?.data?.length && <NoResultsFound margin={0} />}
      </Box>
      <Dialog
        open={drawerOpen}
        onClose={toggleDrawer}
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
            {selectError && <Alert severity="error">{selectError}</Alert>}
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

export default AdminOrdersPage;
