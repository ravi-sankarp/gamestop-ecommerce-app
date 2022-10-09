import { Box, Typography } from '@mui/material';

function DashboardCard({ title, value }) {
  return (
    <Box
      sx={{
        p: 2,
        borderLeft: '5px solid rgb(75, 192, 192)',
        backgroundColor: '#fff',
        minWidth: { md: '15vw' },
        minHeight: '10vh',
        borderRadius: '2px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
    >
      <Typography sx={{ textTransform: 'uppercase' }}>{title}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}
export default DashboardCard;
