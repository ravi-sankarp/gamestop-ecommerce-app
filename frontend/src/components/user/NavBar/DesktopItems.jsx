import { useState, useEffect } from 'react';
import { Box, ListItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

function DesktopItems() {
  const [isSuccess, setIsSuccess] = useState(false);
  const data = useSelector((state) => state.brandAndCategory);

  useEffect(() => {
    if (data.categories.length > 1) {
      setIsSuccess(true);
    }
  }, [data]);

  if (!isSuccess) {
    return null;
  }
  return (
    <Box
      component="ul"
      sx={{
        margin: '0 auto',
        display: { xs: 'none', sm: 'flex' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 4
      }}
    >
      <ListItem disablePadding sx={{ flex: '1 0 0px' }}>
        <Typography
          component={Link}
          to="/products?sort=recommended"
          variant="subtitle1"
          sx={{
            '&:hover': {
              backgroundColor: 'inherit'
            },
            cursor: 'pointer'
          }}
          className="text-link"
        >
          Shop
        </Typography>
      </ListItem>
      <ListItem className="navbar-list" disablePadding sx={{ flex: '1 0 0px' }}>
        <Typography
          variant="subtitle1"
          sx={{
            cursor: 'pointer'
          }}
        >
          Categories
        </Typography>
        <ExpandMoreOutlinedIcon className="dropdown-icon" />

        <div className="navbar-dropdown">
          {data.categories.map((category) => (
            <Typography
              className="text-link"
              key={category.name}
              component={Link}
              to={`/category/${category._id}`}
            >
              {category.name}
            </Typography>
          ))}
        </div>
      </ListItem>
      <ListItem className="navbar-list" disablePadding sx={{ flex: '1 0 0px' }}>
        <Typography
          variant="subtitle1"
          sx={{
            cursor: 'pointer'
          }}
        >
          Brands
        </Typography>
        <ExpandMoreOutlinedIcon className="dropdown-icon" />

        <div className="navbar-dropdown">
          {data.brands.map((brand) => (
            //   <ButtonBase>
            <Typography
              className="text-link"
              key={brand.name}
              component={Link}
              to={`/brand/${brand._id}`}
            >
              {brand.name}
            </Typography>
            //   </ButtonBase>
          ))}
        </div>
      </ListItem>
    </Box>
  );
}

export default DesktopItems;
