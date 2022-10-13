import { Box, Divider, Typography } from '@mui/material';
import { useCallback } from 'react';

function OrderPriceDetails({ order }) {
  const checkCancelled = useCallback((items) => {
    // checking if any item was cancelled
    if (items?.length) {
      return items.find((item) => item.cancelled);
    }
    return items.cancelled ? items : false;
  }, []);
  const cancelled = checkCancelled(order?.items ?? order?.item);

  // checking if any item was returned
  const checkReturned = useCallback((items) => {
    if (items?.length) {
      return items.find((item) => item.returned);
    }
    return items.returned ? items : false;
  }, []);
  const returned = checkReturned(order?.items ?? order?.item);

  return (
    <Box
      sx={{
        flexGrow: { xs: 1, md: 0 },
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mr: { xs: 3, md: 4 },
        background: '#fff !important',
        boxShadow: ' 0 2px 5px 0 rgba(0, 0, 0, 0.1)',
        mb: 7,
        padding: '10px 0',
        width: { md: '20vw' },
        height: 'max-content',
        '& div': {
          pl: 2,
          pr: 2
        }
      }}
    >
      <Typography sx={{ pl: 2 }}>PRICE DETAILS</Typography>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>
Price (
{order?.items?.length ?? 1}
{' '}
items)
        </Typography>
        <Typography>
₹
{order?.totalAmountOriginal?.toLocaleString()}
        </Typography>
      </Box>
      {order.couponApplied && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Coupon Discount</Typography>
            <Typography sx={{ color: 'green' }}>
              ₹
{(order.totalAmountOriginal - order.totalAmountDiscountedOriginal).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Discounted Price</Typography>
            <Typography>
₹
{order.totalAmountDiscountedOriginal.toLocaleString()}
            </Typography>
          </Box>
        </>
      )}
      {order.orderStatus.includes('Cancelled') && (
        <>
          <Divider />
          <Typography
            sx={{ color: 'red' }}
            textAlign="center"
          >
            Order Cancelled
          </Typography>
        </>
      )}
      {order.orderStatus.includes('Cancelled') || (
        <>
          {cancelled && (
            <>
              <Divider />
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', '&>*': { color: 'red' } }}
              >
                <Typography>Cancelled</Typography>
                <Typography>{`- ₹${order?.cancelledAmount.toLocaleString()}`}</Typography>
              </Box>
            </>
          )}
          {returned && (
            <>
              <Divider />
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', '&>*': { color: 'red' } }}
              >
                <Typography>Cancelled</Typography>
                <Typography>{`- ₹${order?.returnedAmount.toLocaleString()}`}</Typography>
              </Box>
            </>
          )}

            <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Bill Total</Typography>
            <Typography>
₹
{order?.totalAmountDiscounted.toLocaleString()}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

export default OrderPriceDetails;
