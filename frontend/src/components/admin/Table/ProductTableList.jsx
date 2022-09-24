/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TablePagination,
  Typography
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useDispatch } from 'react-redux';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDeleteProductMutation } from '../../../redux/api/adminApiSlice';
import { setToast } from '../../../redux/reducers/toastSlice';

import ProductEditForm from '../Forms/Product/ProductEditForm';

export default function UserTableList({ data, categories, brands }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productData, setProductData] = useState({});
  const [operation, setOperation] = useState('');
  const [sendDeleteProduct, { isLoading }] = useDeleteProductMutation();
  const dispatch = useDispatch();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // for alert window
  const handleAlertShow = () => {
    setDialogOpen((current) => !current);
  };

  // open delete confirm dialog
  const handleAction = (selectedProduct, currentOperation) => {
    setProductData(selectedProduct);
    setOperation(currentOperation);
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
      <Paper sx={{ mb: 5, mt: 14 }}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#2987de7a' }}>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Brand</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Orginal Price</TableCell>
                <TableCell align="center">Discounted Price</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                <TableRow
                  key={product.name}
                  sx={{
                    p: 0,
                    '& td': {
                      p: { md: 0 }
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(even) ': { backgroundColor: '#f4f8fd' }
                  }}
                >
                  <TableCell data-label="Name" align="center">
                    {product.name}
                  </TableCell>
                  <TableCell data-label="Brand" align="center">
                    {product.brand[0].name}
                  </TableCell>
                  <TableCell data-label="Category" align="center">
                    {product.category[0].name}
                  </TableCell>
                  <TableCell data-label="Original Price" align="center">
                    {product.price}
                  </TableCell>
                  <TableCell data-label="Discounted Price" align="center">
                    {product.discountedPrice}
                  </TableCell>
                  <TableCell data-label="Stock" align="center">
                    {product.stock}
                  </TableCell>
                  <TableCell data-label="Rating" align="center">
                    {product.rating}
                  </TableCell>
                  <TableCell data-label="Action" align="center">
                    <IconButton
                      onClick={() => handleAction(product, 'edit')}
                      aria-label="edit"
                      color="primary"
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleAction(product, 'delete')}
                      aria-label="delete"
                      color="primary"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={dialogOpen}
        onClose={handleAlertShow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {operation === 'delete' ? (
          <>
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
          </>
        ) : (
          <>
            <DialogTitle>
              <div style={{ display: 'flex' }}>
                <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                  Edit Product
                </Typography>
                <Button color="primary" variant="outlined" onClick={handleAlertShow}>
                  <CloseOutlinedIcon />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <ProductEditForm
                product={productData}
                categories={categories}
                brands={brands}
                close={handleAlertShow}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
