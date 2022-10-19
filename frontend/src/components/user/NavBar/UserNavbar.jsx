import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import DesktopIcons from './DesktopIcons';
import DesktopItems from './DesktopItems';
import { useGetNavlistQuery } from '../../../redux/api/viewsApiSlice';
import { setCategoryAndBrandData } from '../../../redux/reducers/brandAndCategorySlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import MobileDrawer from './MobileDrawer';

function UserNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSuccess, data, isError, error } = useGetNavlistQuery();
  const dispatch = useDispatch();
  if (isError) {
    console.log(error.message);
  }

  const handleDrawerToggle = () => {
    setMobileOpen((current) => !current);
  };

  const drawer = <MobileDrawer handleDrawerToggle={handleDrawerToggle} />;

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCategoryAndBrandData({ brands: data.brands, categories: data.categories }));
    }
    if (isError) {
      dispatch(setToast({ open: true, data: error.data || error.message }));
    }
  }, [isSuccess, data, error, isError, dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        component="nav"
        sx={{ backgroundColor: '#fff', color: '#000 ', height: { xs: '55px', md: '56px' } }}
      >
        <Toolbar sx={{ justifyContent: { md: 'space-between' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            className="text-link"
            to="/"
            sx={{ display: 'block', textAlign: 'left', justifySelf: 'flex-start' }}
          >
            Gamestop
          </Typography>

          <DesktopItems />

          <DesktopIcons />
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default UserNavBar;
