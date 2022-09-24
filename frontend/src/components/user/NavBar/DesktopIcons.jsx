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
  Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { deleteToken } from '../../../redux/reducers/authSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import apiSlice from '../../../redux/api/apiSlice';

function DesktopIcons() {
  const [openAlert, setOpenAlert] = useState(false);
  const data = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const value = data.token ? 'Logout' : 'Login';

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
      icon: (
        <Tooltip title="Search">
          <SearchOutlinedIcon />
        </Tooltip>
      )
    },
    {
      path: 'profile',
      icon: <AccountCircleOutlinedIcon />,
      dropDown:
        value === 'Login' ? (
          <>
            <Typography variant="subtitle2" component={Link} className="text-link" to="/login">
              Login
            </Typography>
            <Typography variant="subtitle2" component={Link} className="text-link" to="/register">
              Register
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="subtitle2" component={Link} className="text-link" to="/profile">
              Profile
            </Typography>
            <Typography variant="subtitle2" component={Link} className="text-link" to="/orders">
              Orders
            </Typography>
            <Typography variant="subtitle2" onClick={handleAlertShow}>
              Logout
            </Typography>
          </>
        )
    },
    {
      path: 'wishlist',
      icon: (
        <Tooltip title="Wishlist">
          <FavoriteBorderOutlinedIcon />
        </Tooltip>
      )
    },
    {
      path: 'cart',
      icon: (
        <Tooltip title="Cart">
          <ShoppingCartOutlinedIcon />
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
          <ListItemIcon className="profile-btn" sx={{ color: '#000', cursor: 'pointer' }}>
            {item.icon}
            <div className="profile-dropdown">{item.dropDown}</div>
          </ListItemIcon>
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
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, pr: 3 }}>
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