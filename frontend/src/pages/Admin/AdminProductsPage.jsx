import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useEffect, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ProductTableList from '../../components/admin/Table/ProductTableList';
import { useGetProductDataQuery } from '../../redux/api/adminApiSlice';
import ProductForm from '../../components/admin/Forms/Product/ProductForm';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';

function AdminProductsPage() {
  const [openPopup, setOpenPopup] = useState(false);
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetProductDataQuery();
  let content;
  const handleError = useApiErrorHandler();
  if (isLoading || (isFetching && !isSuccess)) {
    content = (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <CircularProgress sx={{ overflow: 'hidden' }} color="primary" />
      </Box>
    );
  }

  const handlePopupView = () => {
    setOpenPopup((current) => !current);
  };

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);

  return (
    <Box sx={{ overflowX: 'hidden', pt: 4 }}>
      <Typography variant="h5" sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}>
        PRODUCTS
      </Typography>
      {content}
      {isSuccess && (
        <>
          <Button
            startIcon={<AddBoxIcon />}
            onClick={handlePopupView}
            sx={{ mt: 5, position: 'absolute', right: 16, display: 'flex' }}
            variant="outlined"
          >
            Add Product
          </Button>
          <ProductTableList
            data={data.data.products}
            categories={data.data.categories}
            brands={data.data.brands}
          />
          <Dialog sx={{ height: '100vh' }} onClose={handlePopupView} open={openPopup} maxWidth="md">
            <DialogTitle>
              <div style={{ display: 'flex' }}>
                <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                  Add Product
                </Typography>
                <Button color="primary" variant="outlined" onClick={handlePopupView}>
                  <CloseOutlinedIcon />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <ProductForm
                categories={data.data.categories}
                brands={data.data.brands}
                close={handlePopupView}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default AdminProductsPage;
