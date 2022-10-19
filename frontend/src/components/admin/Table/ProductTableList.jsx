/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useDeleteProductMutation } from '../../../redux/api/adminApiSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import ProductCollapse from './ProductCollapse';

export default function UserTableList({ data }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productData, setProductData] = useState({});
  const [sendDeleteProduct, { isLoading }] = useDeleteProductMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // for alert window
  const handleAlertShow = () => {
    setDialogOpen((current) => !current);
  };

  // open delete confirm dialog
  const handleAction = (selectedProduct) => {
    setProductData(selectedProduct);
    handleAlertShow();
  };

  // confirm delete
  const handleConfirmProductDelete = async () => {
    try {
      if (!isLoading) {
        const res = await sendDeleteProduct({ id: productData._id }).unwrap();
        handleAlertShow();
        dispatch(setToast({ data: res, open: true }));
      }
    } catch (err) {
      handleAlertShow();
      dispatch(setToast({ data: err.data, open: true }));
    }
  };
  return (
    <>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 5 }}>
          {data?.map((product, index) => (
            <Box
              key={product.name}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                alignItems: 'center',
                backgroundColor: '#fff',
                p: 2,
                pr: 2,
                mx: 'auto',
                width: { xs: '75vw', md: '60vw' },
                boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 0px',
                border: '1px solid #dbdbdb',
                borderRadius: '2px',
                '&:hover': {
                  boxShadow: '0 1px 12px 2px #dbdbdb',
                  transition: 'box-shadow 100ms linear'
                }
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  gap: 5,
                  width: '100%',
                  alignItems: 'center',
                  p: 2
                }}
              >
                <Typography
                  data-label="Name"
                  textAlign="center"
                >
                  {index + 1}
                </Typography>
                <Box
                  component="img"
                  src={product.images[0].imgUrl}
                  width="50px"
                />
                <Typography
                  data-label="Name"
                  textAlign="center"
                >
                  {product.name}
                </Typography>
                <Typography
                  data-label="Original Price"
                  textAlign="center"
                >
                  {`₹ ${product.price.toLocaleString()}`}
                </Typography>
                <Typography
                  data-label="Action"
                  textAlign="center"
                >
                  <IconButton
                    onClick={() => navigate(`/admin/editproduct/${product._id}`)}
                    aria-label="edit"
                    color="primary"
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleAction(product)}
                    aria-label="delete"
                    color="primary"
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Typography>
              </Box>
              <ProductCollapse product={product} />
            </Box>
          ))}
        </Box>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={handleAlertShow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the product {productData.name}
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
            onClick={handleConfirmProductDelete}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
