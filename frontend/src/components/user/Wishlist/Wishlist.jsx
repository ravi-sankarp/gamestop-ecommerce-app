/* eslint-disable operator-linebreak */
import { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { Link } from 'react-router-dom';
import {
  useRemoveFromWishlistMutation,
  useMoveToCartMutation
} from '../../../redux/api/userApiSlice';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import useSuccessHandler from '../../../hooks/useSuccessHandler';

function Wishlist({ data }) {
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [removeFromWishlist, { isLoading: removeProductIsLoading }] =
    useRemoveFromWishlistMutation();
  const [moveToCart, { isLoading: moveToCartIsLoading }] = useMoveToCartMutation();

  const successToast = useSuccessHandler();

  const errorToast = useApiErrorHandler();

  const handleMoveToCart = async (productId) => {
    try {
      if (!moveToCartIsLoading) {
        setIsLoadingRequest(true);
        const res = await moveToCart({ id: productId }).unwrap();
        setIsLoadingRequest(false);
        successToast(res);
      }
    } catch (err) {
      setIsLoadingRequest(false);
      errorToast(err);
    }
  };

  const handleProductRemove = async (productId) => {
    try {
      if (!removeProductIsLoading) {
        setIsLoadingRequest(true);
        const res = await removeFromWishlist({ id: productId }).unwrap();
        setIsLoadingRequest(false);
        successToast(res);
      }
    } catch (err) {
      setIsLoadingRequest(false);
      errorToast(err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { md: 'space-around' },
          flexDirection: { xs: 'column', md: 'row' },
          pl: 5
        }}
      >
        <Box
          sx={{
            flexGrow: { xs: 1, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: 7,
            pr: { xs: 5, md: 0 },
            width: {
              md: '60vw'
            }
          }}
        >
          {data?.items.map((item) => (
            <Box
              key={item.productDetails.name}
              sx={{
                background: '#fff !important',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                boxShadow: ' 0 2px 5px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 1px 12px 2px #dbdbdb',
                  transition: 'box-shadow 100ms linear'
                }
              }}
            >
              <Link
                className="text-link"
                to={`/product/${item.productDetails._id}`}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    '& img': {
                      width: '120px',
                      height: '80px',
                      objectFit: 'cover'
                    }
                  }}
                >
                  <img
                    src={item.productDetails.images[0].imgUrl}
                    alt={item.productDetails.name}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      ml: { md: 4 }
                    }}
                  >
                    <Typography>{item.productDetails.name}</Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        pl: 3
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="subtitle"
                        sx={{ color: '#000', opacity: 1 }}
                      >
                        {`₹${item.productDetails.discountedPrice.toLocaleString()}`}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ textDecoration: 'line-through', opacity: 0.5 }}
                        variant="subtitle"
                      >
                        {`₹${item.productDetails.price.toLocaleString()}`}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ color: 'green', opacity: 0.8 }}
                        variant="subtitle"
                      >
                        {`(${item.productDetails.discount}% off )`}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      pointerEvents: 'none',
                      maxWidth: '5px'
                    }}
                    endIcon={<StarIcon />}
                  >
                    {item.productDetails.rating}
                  </Button>
                </Box>
              </Link>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 4,
                  pl: 1,
                  pt: 1
                }}
              >
                <Box
                  onClick={() => handleProductRemove(item.productDetails._id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pl: { md: 4 },
                    '&:hover': { color: '#c92a2a', cursor: 'pointer' }
                  }}
                >
                  <Typography>REMOVE</Typography>

                  <DeleteIcon />
                </Box>
                <Box
                  onClick={() => handleMoveToCart(item.productDetails._id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pl: { md: 4 },
                    '&:hover': { color: '#1a6aed', cursor: 'pointer' }
                  }}
                >
                  <Typography>MOVE TO CART</Typography>
                  <DriveFileMoveIcon />
                </Box>
              </Box>
              {item.productDetails.stock < item.count && (
                <Typography
                  gutterBottom
                  textAlign="right"
                  sx={{ color: 'red', opacity: 0.8 }}
                  variant="subtitle"
                >
                  Product is currently out of stock
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
      {isLoadingRequest && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            width: '100%',
            height: '100vh',
            overflowY: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
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
    </>
  );
}

export default Wishlist;
