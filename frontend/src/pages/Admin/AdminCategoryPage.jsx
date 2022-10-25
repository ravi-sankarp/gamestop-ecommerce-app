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
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useEffect, useState } from 'react';
import { useGetCategoryDataQuery } from '../../redux/api/adminApiSlice';
import CategoryForm from '../../components/admin/Forms/Category/CategoryForm';
import CategoryTableList from '../../components/admin/Table/CategoryTableList';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import HelmetMeta from '../../components/HelmetMeta';

function AdminCategoryPage() {
  const [openPopup, setOpenPopup] = useState(false);
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetCategoryDataQuery();
  const handleError = useApiErrorHandler();
  let content;
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
        <CircularProgress
          sx={{ overflow: 'hidden' }}
          color="primary"
        />
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
      <HelmetMeta title="Category Management | Gamestop" />

      <Typography
        variant="h5"
        sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
      >
        CATEGORIES
      </Typography>
      {content}
      {isSuccess && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<AddBoxIcon />}
              onClick={handlePopupView}
              sx={{ mr: { xs: 3, md: 25 }, maxWidth: 200, backgroundColor: '#fff' }}
            >
              Add Category
            </Button>
          </Box>
          <CategoryTableList data={data.data} />
          <Dialog
            sx={{ height: '100vh', minWidth: '60vw' }}
            onClose={handlePopupView}
            open={openPopup}
            maxWidth="md"
          >
            <DialogTitle>
              <div style={{ display: 'flex' }}>
                <Typography
                  variant="h6"
                  component="div"
                  style={{ flexGrow: 1 }}
                >
                  Add Category
                </Typography>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={handlePopupView}
                >
                  <CloseOutlinedIcon />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <CategoryForm
                data={data.data}
                close={handlePopupView}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default AdminCategoryPage;
