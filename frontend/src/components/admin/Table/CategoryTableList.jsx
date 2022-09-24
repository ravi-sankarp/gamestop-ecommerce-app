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
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDeleteCategoryMutation } from '../../../redux/api/adminApiSlice';

import CategoryEditForm from '../Forms/Category/CategoryEditForm';
import useSuccessHandler from '../../../hooks/useSuccessHandler';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';

export default function CategoryTableList({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [operation, setOperation] = useState('');
  const [sendDeleteCategory, { isLoading }] = useDeleteCategoryMutation();
  const setSuccess = useSuccessHandler();
  const handleError = useApiErrorHandler();

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
  const handleAction = (currentCategory, currentOperation) => {
    setCategoryData(currentCategory);
    setOperation(currentOperation);
    handleAlertShow();
  };

  // confirm delete
  const handleConfirmCategoryDelete = async () => {
    try {
      if (!isLoading) {
        const res = await sendDeleteCategory({ id: categoryData._id }).unwrap();
        handleAlertShow();

        setSuccess(res);
      }
    } catch (err) {
      handleAlertShow();
      handleError(err);
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
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Total Products</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category) => (
                <TableRow
                  key={category.name}
                  sx={{
                    p: 0,
                    '& td': {
                      p: { md: 1 }
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(even) ': { backgroundColor: '#f4f8fd' }
                  }}
                >
                  <TableCell data-label="Name" align="center">
                    {category.name}
                  </TableCell>
                  <TableCell data-label="Description" align="center">
                    {category.description}
                  </TableCell>
                  <TableCell data-label="Total Products" align="center">
                    {category.totalProducts}
                  </TableCell>
                  <TableCell data-label="Action" align="center">
                    <IconButton
                      onClick={() => handleAction(category, 'edit')}
                      aria-label="edit"
                      color="primary"
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleAction(category, 'delete')}
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
                <span>
                  Are you sure you want to delete the Category{' '}
                  <Box
                    component="span"
                    sx={{ color: '#000', fontWeight: '800', textTransform: 'uppercase' }}
                  >
                    {categoryData.name}
                  </Box>
                </span>
                <span>
                  Deleting the Category also deletes{' '}
                  <Box
                    component="span"
                    sx={{ color: '#000', fontWeight: '800', textTransform: 'uppercase' }}
                  >
                    {categoryData.totalProducts} Products
                  </Box>{' '}
                  along with it
                </span>
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
                  Edit Category
                </Typography>
                <Button color="primary" variant="outlined" onClick={handleAlertShow}>
                  <CloseOutlinedIcon />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <CategoryEditForm categoryData={categoryData} close={handleAlertShow} />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
