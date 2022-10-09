/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Box, Button, Grid, List, ListItem, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ReactImageMagnify from 'react-image-magnify';
import { PrimaryButton, SecondaryButton } from '../../../MaterialUiConfig/styled';
import { useUpdateCartMutation, useUpdateWishlistMutation } from '../../../redux/api/userApiSlice';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import useSuccessHandler from '../../../hooks/useSuccessHandler';

function SingleProduct({ product }) {
  const [img, setImg] = useState(product.images[0].imgUrl);
  const [cartText, setCartText] = useState('Add to Cart');
  const [wishlistText, setWishlistText] = useState('Add to Wishlist');
  const [addToCart, { isLoading }] = useUpdateCartMutation();
  const [addToWishlist, { isLoading: addToWishlistIsLoading }] = useUpdateWishlistMutation();
  const successToast = useSuccessHandler();
  const errorToast = useApiErrorHandler();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleImgHover = (e) => {
    if (e.target.tagName === 'IMG') {
      setImg(e.target.src);
    }
  };
  const handleAddToCart = async (id) => {
    try {
      if (!isLoading) {
        setCartText('Adding...');
        const res = await addToCart({ productId: id, count: 1 }).unwrap();
        successToast(res);
      }
    } catch (err) {
      errorToast(err);
    } finally {
      setCartText('Add to Cart');
    }
  };
  const handleAddToWishlist = async (id) => {
    try {
      if (!addToWishlistIsLoading) {
        setWishlistText('Adding...');
        const res = await addToWishlist({ productId: id }).unwrap();
        successToast(res);
      }
    } catch (err) {
      errorToast(err);
    } finally {
      setWishlistText('Add to Wishlist');
    }
  };
  return (
    <Grid
      container
      rowSpacing={{ xs: 5, lg: 4 }}
      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      sx={{ padding: { lg: '0px 3rem', xs: '0px 10px' } }}
    >
      <Grid
        item
        xs={12}
        md={6}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          component="img"
          src={img}
          sx={{
            width: '100%',
            height: 300,
            objectFit: 'contain',
            display: { xs: 'block', lg: 'none' }
          }}
          alt=""
        />
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: 'img',
                width: 500,
                height: 500,
                src: img
              },
              largeImage: {
                src: img,
                width: 1200,
                height: 1800
              },
              enlargedImageContainerDimensions: {
                width: '120%',
                height: '100%'
              },
              enlargedImageContainerStyle: {
                zIndex: '10',
                left: '120%'
              }
            }}
          />
        </Box>

        <Box
          sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'space-evenly', mt: 3 }}
          onMouseOver={handleImgHover}
        >
          {product.images.map((item) => (
            <Box
              key={item.public_id}
              component="img"
              src={item.imgUrl}
              sx={
                item.imgUrl === img
                  ? {
                      boxShadow:
                        'rgba(0, 0, 251, 0.16) 0px 1px 1px, rgb(231, 118, 0) 0px 0px 0px 2px',
                      width: 80,
                      height: 80
                    }
                  : { width: 80, height: 80 }
              }
              alt={product.name}
            />
          ))}
        </Box>
      </Grid>
      <Grid
        item
        rowSpacing={2}
        xs={12}
        md={6}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          component="div"
          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Typography
            gutterBottom
            variant="h5"
          >
            {product.details}
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ pointerEvents: 'none', maxWidth: '15px' }}
            endIcon={<StarIcon />}
          >
            {product.rating}
          </Button>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography
              gutterBottom
              variant="subtitle"
              sx={{ color: '#000', opacity: 1, fontWeight: '550', fontSize: 25 }}
            >
              {`₹${product.discountedPrice.toLocaleString()}`}
            </Typography>
            <Typography
              gutterBottom
              sx={{ textDecoration: 'line-through', opacity: 0.5 }}
              variant="subtitle"
            >
              {`₹${product.price.toLocaleString()}`}
            </Typography>
            <Typography
              gutterBottom
              sx={{ color: 'green', opacity: 0.8 }}
              variant="subtitle"
            >
              {`(${product.discount}% off )`}
            </Typography>
          </Box>
          {product.stock > 1 && product.stock < 10 && (
            <Typography
              gutterBottom
              sx={{ color: 'red', opacity: 0.8 }}
              variant="subtitle"
            >
              {`Hurry only ${product.stock} items left `}
            </Typography>
          )}
          {product.stock === 0 && (
            <Typography
              gutterBottom
              sx={{ color: 'red', opacity: 0.8 }}
              variant="subtitle"
            >
              The items is currently out of stock
            </Typography>
          )}
        </Box>
        <List
          sx={{
            listStyleType: 'disc',

            '& .MuiListItem-root': {
              display: 'list-item',
              ml: 3
            }
          }}
        >
          <Typography variant="h6">Product Highlights : </Typography>
          {product.keyFeatures.split(',').map((feature) => (
            <ListItem
              key={feature.split(':')[0]}
              disablePadding
            >
              <Box
                component="span"
                sx={{ display: 'flex', gap: 1 }}
              >
                <p>{`${feature.split(':')[0]}  :`}</p>
                <p>{feature.split(':')[1]}</p>
              </Box>
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
          <PrimaryButton
            onClick={() => handleAddToCart(product._id)}
            sx={{ flex: '1' }}
          >
            {cartText}
          </PrimaryButton>
          <SecondaryButton
            onClick={() => handleAddToWishlist(product._id)}
            sx={{ flex: '1', height: '50px' }}
          >
            {wishlistText}
          </SecondaryButton>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SingleProduct;
