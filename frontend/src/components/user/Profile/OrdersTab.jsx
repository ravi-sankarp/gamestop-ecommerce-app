/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable operator-linebreak */
import { useCallback, useEffect, useRef, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { useGetUserOrdersQuery } from '../../../redux/api/userApiSlice';
import OrderTable from '../Orders/OrderTable';
import HelmetMeta from '../../HelmetMeta';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';

export default function CollapsibleTable() {
  const orderObserver = useRef();
  const [page, setPage] = useState(0);
  const [resData, setResData] = useState([]);
  const { data, isFetching, isLoading, isSuccess, isError, error } = useGetUserOrdersQuery({
    page
  });
  const errorToast = useApiErrorHandler();
  useEffect(() => {
    if (isError) {
      errorToast(error);
    }
  }, [isError, error, errorToast]);
  useEffect(() => {
    if (isSuccess) {
      if (data?.data?.orders) {
        setResData((prevResData) => [...prevResData, ...data.data.orders]);
      }
    }
  }, [data, isSuccess]);

  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (orderObserver.current) orderObserver.current.disconnect();
      orderObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && data?.data?.totalOrders > resData.length) {
            setPage((prevPageNumber) => prevPageNumber + 1);
          }
        },
        {
          rootMargin: '100px'
        }
      );
      if (node) orderObserver.current.observe(node);
    },
    [data?.data?.totalOrders, isLoading, resData.length]
  );

  let content;
  if (isLoading || (isFetching && !isSuccess)) {
    content = (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
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
  return (
    <>
      <HelmetMeta title="User Orders | Gamestop" />
      <Box sx={{ pt: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
        {content}
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
          {isSuccess &&
            resData.length &&
            resData.map((order, index) => (
              <Box
                {...(resData.length === index + 1 ? { ref: lastBookElementRef } : {})}
                key={order.orderedOn}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  width: '80vw',
                  maxWidth: '80vw',
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
                    justifyContent: 'space-evenly',
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
                    {`${order.orderStatus} on 
                          ${new Date(order.orderStatusUpdatedOn).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })} `}
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#868e96', fontSize: 12 }}>Total Amount </Typography>
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      {`₹ ${order?.totalAmountDiscountedOriginal.toLocaleString()}`}
                    </Typography>
                  </Box>
                </Box>
                <OrderTable
                  key={order.orderedOn}
                  order={order}
                  items={order.items ?? order.item}
                />
              </Box>
            ))}
          {isFetching && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '10vh',
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
          )}
        </Box>
      </Box>
    </>
  );
}
