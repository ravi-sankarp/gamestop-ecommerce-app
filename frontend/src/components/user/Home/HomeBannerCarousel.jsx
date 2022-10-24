/* eslint-disable react/jsx-props-no-spreading */
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Box, Skeleton } from '@mui/material';
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

  if (isLoading || isFetching) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '30vh',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: '100%', minHeight: '50vh' }}
        />
      </Box>
    );
  }

  return (
    isSuccess && (
      <Carousel
        showStatus={false}
        infiniteLoop
        autoPlay
        showThumbs={false}
        stopOnHover
        dynamicHeight={50}
        className="home-carousel"
      >
        {data?.data?.map((banner) => (
          <Box
            key={banner._id}
            component="img"
            loading="lazy"
            src={banner?.bannerImg.imgUrl}
            alt={banner?.title}
            sx={{ height: '50vh', aspectRatio: '16/9', objectFit: { xs: 'contain', md: 'cover' } }}
          />
        ))}
      </Carousel>
    )
  );
}

export default HomeBannerCarousel;
