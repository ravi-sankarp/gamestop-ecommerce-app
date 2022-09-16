import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { deleteToken } from '../../../redux/reducers/authSlice';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme)
    })
  })
);

function Sidebar() {
  const [open, setOpen] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);

  const { pathname } = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let title = pathname.split('/')[2];
  title = title[0].toUpperCase() + title.slice(1);
  if (title === 'Login') {
    return null;
  }
  // for sidebar
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // for alert window
  const handleAlertShow = () => {
    setOpenAlert((current) => !current);
  };

  const setListLogo = (text) => {
    switch (text) {
      case 'Dashboard':
        return (
          <Tooltip title="Dashboard" placement="right-end">
            <DashboardOutlinedIcon />
          </Tooltip>
        );
      case 'Users':
        return (
          <Tooltip title="Users" placement="right-end">
            <GroupsOutlinedIcon />
          </Tooltip>
        );
      case 'Products':
        return (
          <Tooltip title="Products" placement="right-end">
            <InventoryOutlinedIcon />
          </Tooltip>
        );
      case 'Categories':
        return (
          <Tooltip title="Categories" placement="right-end">
            <CategoryOutlinedIcon />
          </Tooltip>
        );
      case 'Brands':
        return (
          <Tooltip title="Brands" placement="right-end">
            <ClassOutlinedIcon />
          </Tooltip>
        );
      case 'Banners':
        return (
          <Tooltip title="Banners" placement="right-end">
            <WallpaperOutlinedIcon />
          </Tooltip>
        );
      case 'Orders':
        return (
          <Tooltip title="Orders" placement="right-end">
            <ShoppingCartOutlinedIcon />
          </Tooltip>
        );
      case 'Payments':
        return (
          <Tooltip title="Payments" placement="right-end">
            <PaymentOutlinedIcon />
          </Tooltip>
        );
      default:
        return null;
    }
  };
  const handleLogout = async () => {
    await dispatch(deleteToken());
    setOpenAlert(false);
    navigate('/admin/login');
  };
  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' })
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} sx={{ backgroundColor: '#000000 !important' }}>
          <DrawerHeader>
            <Typography variant="h6" sx={{ margin: 'auto' }} noWrap component="div">
              GameStop
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {[
              'Dashboard',
              'Users',
              'Products',
              'Categories',
              'Brands',
              'Banners',
              'Orders',
              'Payments'
            ].map((text) => (
              <ListItem
                component={Link}
                to={`/admin/${text[0].toLowerCase()}${text.slice(1)}`}
                key={text}
                disablePadding
                className="text-link"
                sx={{
                  ...(text === title ? { backgroundColor: 'lightgray' } : {})
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      mt: 1,
                      justifyContent: 'center',
                      color: '#000000'
                    }}
                  >
                    {setListLogo(text)}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, color: 'black' }} />
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem onClick={handleAlertShow} disablePadding sx={{ mt: '2rem' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5
                }}
              >
                <Tooltip title="Logout">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      mt: 1,
                      justifyContent: 'center',
                      color: '#000000'
                    }}
                  >
                    <LogoutOutlinedIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  primary="Logout"
                  sx={{ opacity: open ? 1 : 0, mt: 1.2, color: 'black' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
      <Dialog
        open={openAlert}
        onClose={handleAlertShow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Logout </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#339af0', '&:hover': { backgroundColor: '#1c7ed6' } }}
            onClick={handleAlertShow}
          >
            No
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#fa5252',
              '&:hover': { backgroundColor: '#e03131' }
            }}
            onClick={handleLogout}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default Sidebar;
