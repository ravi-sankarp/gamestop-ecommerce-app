import { Box, Divider, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

function UserFooter() {
  const { brands } = useSelector((state) => state.brandAndCategory);
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#172337',
        padding: '45px 0 20px',
        fontSize: '15px',
        lineHeight: '24px',
        color: '#737373'
      }}
    >
      <Box sx={{ padding: '10px 30px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4
          }}
        >
          <Box>
            <Typography
              textAlign="center"
              sx={{ color: '#fff' }}
            >
              About
            </Typography>
            <Typography>
              Gamestop is an ecommerce app where you could purchase gaming utilities to increase
              your gaming.We sell authenticated products and has collaboration with many brands.
            </Typography>
          </Box>
          <Box>
            <Typography
              textAlign="center"
              sx={{ color: '#fff', mb: 1 }}
            >
              Our Partners
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {brands.length
                && brands.map((brand) => (
                  <Typography
                    key={brand.name}
                    sx={{ textTransform: 'uppercase' }}
                  >
                    {brand.name}
                  </Typography>
                ))}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: '#fff' }} />
      </Box>
      <Box className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <Typography textAlign="center">
              Copyright &copy; 2022 All Rights Reserved by Gamestop
            </Typography>
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default UserFooter;
