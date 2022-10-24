import { Grid, Skeleton } from '@mui/material';
import React from 'react';

function CardLoadingHome({ width = 3 }) {
  return (
    <Grid
      container
      rowSpacing={4}
      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      sx={{ my: 10, alignItems: 'center', justifyContent: 'center' }}
    >
      {[1, 2, 3, 4].map((item) => (
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          lg={width}
          xl={width}
          align="center"
        >
          <Skeleton
            key={item}
            variant="rectangular"
            height={150}
            sx={{
              maxWidth: { xs: 300, lg: 300 },
              minHeight: { xs: 150, lg: 240 }
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default CardLoadingHome;
