/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-closing-tag-location */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useChangeUserStatusMutation } from '../redux/api/adminApiSlice';
import { setToast } from '../redux/reducers/toastSlice';

function ConfirmDialog({ open, setOpen, data }) {
  const [changeuserstatus, { isLoading }] = useChangeUserStatusMutation();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = async (_id) => {
    if (!isLoading) {
      try {
        const res = await changeuserstatus({ id: _id }).unwrap();
        handleClose();
        dispatch(setToast({ data: res, open: true }));
      } catch (err) {
        dispatch(setToast({ data: err, open: true }));
      }
    }
  };

  const operation = data.isBlocked ? 'Unblock' : 'BLOCK';
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm {operation}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to{' '}
            <span
              style={{ color: '#000' }}
            >{`${operation} ${data.firstName} ${data.lastName} `}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#339af0', '&:hover': { backgroundColor: '#1c7ed6' } }}
            onClick={handleClose}
          >
            No
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#fa5252',
              '&:hover': { backgroundColor: '#e03131' },
              ...(operation === 'Unblock' && {
                backgroundColor: '#282C35',
                '&:hover': { backgroundColor: '#000' }
              })
            }}
            onClick={() => handleConfirm(data._id)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;
