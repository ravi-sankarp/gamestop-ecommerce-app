import { Box, Typography } from '@mui/material';
import ProfileTabs from '../../components/user/Profile/TabLayout';

function UserProfilePage() {
  return (
    <Box sx={{ backgroundColor: '#f1f3f6' }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ pt: 3 }}
      >
        My Profile
      </Typography>
      <ProfileTabs />
    </Box>
  );
}

export default UserProfilePage;
