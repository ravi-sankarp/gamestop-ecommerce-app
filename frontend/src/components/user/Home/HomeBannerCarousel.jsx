/* eslint-disable react/jsx-props-no-spreading */
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import { useGetAllBannersQuery } from '../../../redux/api/viewsApiSlice';

function HomeBannerCarousel() {
  const { data, isFetching, isLoading, isSuccess, isError, error } = useGetAllBannersQuery();
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
    <Carousel
      showStatus={false}
      infiniteLoop
      autoPlay
    >
      {data?.data?.map((banner) => (
        <Box
          component="img"
          src={banner?.bannerImg.imgUrl}
          alt={banner?.title}
          sx={{ height: '300px', objectFit: 'cover', aspectRatio: '16/9' }}
        />
      ))}
    </Carousel>
  );
}

export default HomeBannerCarousel;