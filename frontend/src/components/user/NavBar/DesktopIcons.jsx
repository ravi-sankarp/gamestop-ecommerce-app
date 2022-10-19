import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemIcon,
  Tooltip,
  Typography,
  Badge
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { deleteToken } from '../../../redux/reducers/authSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import apiSlice from '../../../redux/api/apiSlice';
import { useGetCartAndWishlistCountQuery } from '../../../redux/api/userApiSlice';
import SearchBar from './Searchbar';

function DesktopIcons() {
  const [openAlert, setOpenAlert] = useState(false);
  const { token } = useSelector((state) => state.auth.data);
  const { data: result } = useGetCartAndWishlistCountQuery('Get cart count', { skip: !token });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const value = token ? 'Logout' : 'Login';

  // for alert window
  const handleAlertShow = () => {
    setOpenAlert((current) => !current);
  };

  const handleLogout = async () => {
    await dispatch(deleteToken());
    await dispatch(apiSlice.util.resetApiState());
    const message = { message: 'Successfully Logged Out' };
    dispatch(setToast({ open: true, data: message }));
    setOpenAlert(false);
    navigate('/');
  };

  const navItems = [
    {
      path: 'search',
      icon: <SearchBar />
    },
    {
      path: 'profile',
      icon: <AccountCircleOutlinedIcon />,
      dropDown:
        value === 'Login' ? (
          <>
            <Typography
              variant="subtitle2"
              component={Link}
              className="text-link"
              to="/login"
            >
              Login
            </Typography>
            <Typography
              variant="subtitle2"
              component={Link}
              className="text-link"
              to="/register"
            >
              Register
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="subtitle2"
              component={Link}
              className="text-link"
              to="/profile?profile=info"
            >
              Profile
            </Typography>

            <Typography
              variant="subtitle2"
              onClick={handleAlertShow}
            >
              Logout
            </Typography>
          </>
        )
    },
    {
      path: 'wishlist',
      icon: (
        <Tooltip title="Wishlist">
          <Badge
            variant="dot"
            invisible={!result?.data['1']?.wishlistCount}
            color="error"
          >
            <FavoriteBorderOutlinedIcon />
          </Badge>
        </Tooltip>
      )
    },
    {
      path: 'cart',
      icon: (
        <Tooltip title="Cart">
          <Badge
            variant="dot"
            invisible={!result?.data['0']?.cartCount}
            color="error"
          >
            <ShoppingCartOutlinedIcon />
          </Badge>
        </Tooltip>
      )
    }
  ];
  const displayItem = (item) => {
    if (item.path === 'profile') {
      return (
        <ListItem
          sx={{
            '&:hover': {
              backgroundColor: 'inherit'
            },
            position: 'relative',
            width: '20px',
            height: '15px'
          }}
          key={item.path}
          disablePadding
        >
          <ListItemIcon
            className="profile-btn"
            sx={{ color: '#000', cursor: 'pointer' }}
          >
            {item.icon}
            <div className="profile-dropdown">{item.dropDown}</div>
          </ListItemIcon>
        </ListItem>
      );
    }
    if (item.path === 'search') {
      return (
        <ListItem
          sx={{
            '&:hover': {
              backgroundColor: 'inherit'
            },
            cursor: 'pointer',
            width: '20px',
            height: '15px'
          }}
          key={item.path}
          disablePadding
        >
          <ListItemIcon sx={{ color: '#000' }}>{item.icon}</ListItemIcon>
        </ListItem>
      );
    }
    return (
      <ListItem
        component={Link}
        sx={{
          '&:hover': {
            backgroundColor: 'inherit'
          },
          cursor: 'pointer',
          width: '20px',
          height: '15px'
        }}
        className="text-link"
        to={item.path}
        key={item.path}
        disablePadding
      >
        <ListItemIcon sx={{ color: '#000' }}>{item.icon}</ListItemIcon>
      </ListItem>
    );
  };
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          ml: { xs: 'auto', sm: 0 },
          gap: 2,
          pr: 3
        }}
      >
        {navItems.map((item) => displayItem(item))}
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

export default DesktopIcons;
