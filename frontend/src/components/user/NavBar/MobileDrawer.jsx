import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MobileDrawerAccordian from './MobileDrawerAccordian';
import { deleteToken } from '../../../redux/reducers/authSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import apiSlice from '../../../redux/api/apiSlice';

function MobileDrawer({ handleDrawerToggle }) {
  const [openAlert, setOpenAlert] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    handleDrawerToggle();
  };

  return (
    <>
      <Box sx={{ textAlign: 'center', color: '#000', height: '90vh', position: 'relative' }}>
        <Typography
          variant="h6"
          sx={{ my: 2, color: '#000' }}
        >
          Gamestop
        </Typography>
        <Divider />
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="subtitle1"
            component={Link}
            onClick={handleDrawerToggle}
            to="/products?sort=recommended"
            sx={{ color: '#000', pl: 2, mb: 1 }}
            className="text-link"
            textAlign="left"
          >
            SHOP ALL
          </Typography>
          <Divider />
          <MobileDrawerAccordian handleDrawerToggle={handleDrawerToggle} />
        </Box>
        <Divider />
        <Button
          onClick={handleAlertShow}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          Logout
          <LogoutOutlinedIcon />
        </Button>
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
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MobileDrawer;
