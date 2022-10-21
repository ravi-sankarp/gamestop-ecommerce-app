import { Box, Skeleton } from '@mui/material';
import React from 'react';

function CardLoadingHome() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '30vh',
        overflowY: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mt: 23,
        justifyContent: { xs: 'center', md: 'space-around' },
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      {[1, 2, 3, 4].map((item) => (
        <Skeleton
          key={item}
          variant="rectangular"
          height={150}
          sx={{
            width: {
              xs: 160,
              md: 250
            }
          }}
        />
      ))}
    </Box>
  );
}

export default CardLoadingHome;
