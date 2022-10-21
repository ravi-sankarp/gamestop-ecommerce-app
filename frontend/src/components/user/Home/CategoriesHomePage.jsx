import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import HomeListCards from './HomeCards';

function CategoriesHomePage() {
  const { categories } = useSelector((state) => state.brandAndCategory);

  if (!categories?.length) {
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
        <CircularProgress
          sx={{ overflow: 'hidden' }}
          color="primary"
        />
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
        CATEGORIES
      </Typography>
      <HomeListCards
        data={categories}
        type="category"
      />
    </Box>
  );
}

export default CategoriesHomePage;
