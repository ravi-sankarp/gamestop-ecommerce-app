import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../MaterialUiConfig/styled';

function PageNotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh'
      }}
    >
      <Box
        component="img"
        src="/imgs/404image.png"
        alt="Page not found"
      />
      <Typography>The page you are looking for was not found</Typography>
      <PrimaryButton
        component={Link}
        to="/"
      >
        Go to homepage
      </PrimaryButton>
    </Box>
  );
}

export default PageNotFound;
