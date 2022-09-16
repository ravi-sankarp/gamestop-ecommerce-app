import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from '../redux/reducers/toastSlice';

function DisplayMessage() {
  const { open, data } = useSelector((state) => state.toast.data);
  const dispatch = useDispatch();
  if (!open) {
    return null;
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(clearToast());
  };
  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );
  if (data?.title) {
    return (
      <Snackbar
        message="Something went wrong please try again"
        autoHideDuration={2000}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      />
    );
  }
  return (
    <Snackbar
      open={open}
      message={data?.message || data.data || 'Something went wrong please try again'}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      action={action}
    />
  );
}

export default DisplayMessage;
