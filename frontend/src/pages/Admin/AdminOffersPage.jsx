/* eslint-disable operator-linebreak */
import { useState, useEffect } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from '@mui/material';
import AddCategoryOfferForm from '../../components/admin/Offers/AddCategoryOffer';
import CategoryOfferTable from '../../components/admin/Offers/CategoryOffersTable';
import ProductOfferTable from '../../components/admin/Offers/ProductOffersTable';
import HelmetMeta from '../../components/HelmetMeta';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useGetAllOffersQuery } from '../../redux/api/adminApiSlice';
import { useGetProductAndCategoriesQuery } from '../../redux/api/viewsApiSlice';
import AddProductOfferForm from '../../components/admin/Offers/AddProductOffer';

function AdminOffersPage() {
  const [open, setOpen] = useState(false);
  const [operation, setOperation] = useState('');
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetAllOffersQuery();
  const {
    data: productAndCategoryData,
    isLoading: isLoadingProductAndCategoryData,
    isFetching: isFetchingProductAndCategoryData,
    isSuccess: isSuccessProductAndCategoryData,
    isError: isErrorProductAndCategoryData,
    error: errorProductAndCategoryData
  } = useGetProductAndCategoriesQuery();
  let content;
  const handleError = useApiErrorHandler();
  useEffect(() => {
    if (isError) {
      handleError(error);
    }
    if (isErrorProductAndCategoryData) {
      handleError(errorProductAndCategoryData);
    }
  }, [isError, error, handleError, isErrorProductAndCategoryData, errorProductAndCategoryData]);

  if (
    isLoading ||
    (isFetching && !isSuccess) ||
    isLoadingProductAndCategoryData ||
    (isFetchingProductAndCategoryData && !isSuccessProductAndCategoryData)
  ) {
    return (
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
        <CircularProgress
          sx={{ overflow: 'hidden' }}
          color="primary"
        />
      </Box>
    );
  }

  const handleAlertShow = () => {
    setOpen((current) => !current);
  };

  const handleSetOperation = (operationName) => {
    setOperation(operationName);
    handleAlertShow();
  };

  return (
    <>
      <HelmetMeta title="Admin Offers Page | Gamestop" />
      <Box sx={{ overflowX: 'hidden', pt: 4 }}>
        <Typography
          variant="h5"
          sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
        >
          OFFERS
        </Typography>
        {content}
        {!data?.data?.categoryOffers?.length && (
          <Box>
            <Typography>You have not added any category orders till now</Typography>
          </Box>
        )}
        {!data?.data?.productOffers?.length && (
          <Box>
            <Typography>You have not added any product orders till now</Typography>
          </Box>
        )}

        <Grid
          container
          columnSpacing={3}
          rowSpacing={3}
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            {!!data?.data?.categoryOffers?.length && (
              <>
                <Typography
                  textAlign="center"
                  variant="h5"
                >
                  Category Offers
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleSetOperation('Category Offer')}
                  sx={{ mt: 4 }}
                >
                  Add Category Offer
                </Button>
                <CategoryOfferTable
                  categories={productAndCategoryData.data.categories}
                  categoryOffers={data.data.categoryOffers}
                />
              </>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            {!!data?.data?.productOffers?.length && (
              <>
                <Typography
                  textAlign="center"
                  variant="h5"
                >
                  Product Offers
                </Typography>
                <Button
                  sx={{ mt: 4 }}
                  variant="outlined"
                  onClick={() => handleSetOperation('Product Offer')}
                >
                  Add Product Offer
                </Button>
                <ProductOfferTable
                  products={productAndCategoryData.data.products}
                  productOffers={data.data.productOffers}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={open}
        onClose={handleAlertShow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          minWidth: '40vw'
        }}
      >
        <DialogTitle>
          <div style={{ display: 'flex' }}>
            <Typography
              variant="h6"
              component="div"
              style={{ flexGrow: 1 }}
            >
              Add
              {operation}
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleAlertShow}
            >
              <CloseOutlinedIcon />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {operation === 'Product Offer' ? (
            <AddProductOfferForm
              products={productAndCategoryData?.data?.products}
              close={handleAlertShow}
            />
          ) : (
            <AddCategoryOfferForm
              categories={productAndCategoryData?.data?.categories}
              close={handleAlertShow}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminOffersPage;
