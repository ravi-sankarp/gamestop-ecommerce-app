import { Box, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import CardLoadingHome from './CardLoadingHome';
import HomeListCards from './HomeCards';

function BrandsHomePage() {
  const { brands } = useSelector((state) => state.brandAndCategory);

  if (!brands?.length) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '30vh',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <CardLoadingHome />
      </Box>
    );
  }
  return (
    <Box sx={{ my: 4 }}>
      <Typography
        variant="h5"
        textAlign="center"
        sx={{ my: 5 }}
      >
        BRANDS
      </Typography>
      <HomeListCards
        data={brands}
        type="brand"
      />
    </Box>
  );
}

export default BrandsHomePage;
