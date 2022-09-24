import { Box, Typography } from '@mui/material';

function NoResultsFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 3,
        width: '100%',
        height: '100%',
        mt: 10
      }}
    >
      <img
        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png"
        alt="Sorry No Results Where Found"
      />
      <Typography variant="h4">Sorry, no results found!</Typography>
      <Typography sx={{ color: '#000', opacity: 0.5 }}>
        Please try a different filter or search
      </Typography>
    </Box>
  );
}

export default NoResultsFound;
