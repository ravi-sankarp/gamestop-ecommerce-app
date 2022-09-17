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
  Box,
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
import { useDeleteBrandMutation } from '../../../redux/api/adminApiSlice';
import { setToast } from '../../../redux/reducers/toastSlice';

import BrandEditForm from '../Forms/Brand/BrandEditForm';

export default function CategoryTableList({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [brandData, setBrandData] = useState({});
  const [operation, setOperation] = useState('');
  const [sendDeleteBrand, { isLoading }] = useDeleteBrandMutation();
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
  const handleAction = (currentBrand, currentOperation) => {
    setBrandData(currentBrand);
    setOperation(currentOperation);
    handleAlertShow();
  };

  // confirm delete
  const handleConfirmCategoryDelete = async () => {
    try {
      if (!isLoading) {
        const res = await sendDeleteBrand({ id: brandData._id }).unwrap();
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
      <Paper sx={{ mb: 5, mt: 4 }}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#2987de7a' }}>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Total Products</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((brand) => (
                <TableRow
                  key={brand.name}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(even) ': { backgroundColor: ' #3774ad2e' }
                  }}
                >
                  <TableCell data-label="Name" align="center">
                    {brand.name}
                  </TableCell>
                  <TableCell data-label="Description" align="center">
                    {brand.description}
                  </TableCell>
                  <TableCell data-label="Total Products" align="center">
                    {brand.totalProducts}
                  </TableCell>
                  <TableCell data-label="Action" align="center">
                    <IconButton
                      onClick={() => handleAction(brand, 'edit')}
                      aria-label="edit"
                      color="primary"
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleAction(brand, 'delete')}
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
                <p>
                  Are you sure you want to delete the Brand{' '}
                  <Box
                    component="span"
                    sx={{ color: '#000', fontWeight: '800', textTransform: 'uppercase' }}
                  >
                    {brandData.name}
                  </Box>
                </p>
                <p>
                  Deleting the Brand also deletes{' '}
                  <Box
                    component="span"
                    sx={{ color: '#000', fontWeight: '800', textTransform: 'uppercase' }}
                  >
                    {brandData.totalProducts} Products
                  </Box>{' '}
                  along with it
                </p>
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
                onClick={handleConfirmCategoryDelete}
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
                  Edit Brand
                </Typography>
                <Button color="primary" variant="outlined" onClick={handleAlertShow}>
                  <CloseOutlinedIcon />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <BrandEditForm brandData={brandData} close={handleAlertShow} />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
