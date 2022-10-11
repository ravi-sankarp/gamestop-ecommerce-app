/* eslint-disable operator-linebreak */
import { useEffect } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { useGetUserOrdersQuery } from '../../../redux/api/userApiSlice';
import OrderTable from '../Orders/OrderTable';
import HelmetMeta from '../../HelmetMeta';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';

export default function CollapsibleTable() {
  const { data, isFetching, isLoading, isSuccess, isError, error } = useGetUserOrdersQuery();
  const errorToast = useApiErrorHandler();
  useEffect(() => {
    if (isError) {
      errorToast(error);
    }
  }, [isError, error, errorToast]);

  if (isLoading || (isFetching && !isSuccess)) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,0%)',
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
  return (
    <>
      <HelmetMeta title="User Orders | Gamestop" />
      <Box sx={{ pt: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
        {data?.message && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              pt: 4,
              p: 3,
              mx: 'auto',

              '& img': {
                width: '300px'
              }
            }}
          >
            <Typography
              sx={{ whiteSpace: 'nowrap' }}
              variant="h6"
            >
              {data.message}
            </Typography>
            <Typography sx={{ color: '#333333' }}>Buy some products to see it here!</Typography>
            <PrimaryButton
              component={Link}
              to="/products?sort=recommended"
              sx={{ mt: 0 }}
            >
              Shop Now
            </PrimaryButton>
          </Box>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {data?.data &&
            data.data.map((order) => (
              <Box
                key={order.orderedOn}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  width: '80vw',
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography sx={{ color: '#868e96' }}>
                      {order.items ? 'Products Name' : 'Product Name'}
                    </Typography>
                    <Typography>{order?.item?.productName}</Typography>
                    {order?.items?.map((item) => (
                      <Typography>{item.productName}</Typography>
                    ))}
                  </Box>
                  <Box>
                    <Typography
                      textAlign="right"
                      sx={{ whiteSpace: 'nowrap', color: '#868e96' }}
                    >
                      Payment Method
                    </Typography>
                    <Typography textAlign="center">{order.paymentMethod}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#868e96' }}>Order Status</Typography>
                    {order.orderStatus.includes('Cancelled') ||
                    order.orderStatus.includes('Retured') ? (
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
                    <Typography sx={{ color: '#868e96' }}>Total Amount </Typography>
                    <Typography>{`₹ ${order.totalAmount.toLocaleString()}`}</Typography>
                  </Box>
                </Box>
                <OrderTable
                  key={order.orderedOn}
                  order={order}
                  items={order.items ?? order.item}
                />
              </Box>
            ))}
        </Box>
      </Box>
    </>
  );
}
