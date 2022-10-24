import { Box, Typography } from '@mui/material';

function NoResultsFound({ margin = 10 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 3,
        width: '100%',
        height: 'max-content',
        mt: margin
      }}
    >
      <img
        src="/imgs/noresultsfound.png"
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
