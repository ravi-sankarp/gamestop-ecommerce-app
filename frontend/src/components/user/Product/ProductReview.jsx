import { useSelector } from 'react-redux';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { useCheckReviewEligibilityQuery } from '../../../redux/api/userApiSlice';
import { useGetProductReviewsQuery } from '../../../redux/api/viewsApiSlice';
import AddReviewForm from '../Forms/AddReviewForm';

function ProductReview() {
  const { token } = useSelector((state) => state.auth.data);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetProductReviewsQuery(id);
  const {
    isLoading: isLoadingEligibility,
    isFetching: isFetchingEligibility,
    isError: isErrorEligibility,
    isSuccess: isSuccessEligibility,
    data: reviewCheckData,
    error: errorReviewCheck
  } = useCheckReviewEligibilityQuery(id, {
    skip: !token
  });
  const handleError = useApiErrorHandler();

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);

  const toggleForm = () => {
    setOpen((current) => !current);
  };

  if (isLoading || isFetching) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '30vh',
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
  const checkEligible = () => {
    if (isLoadingEligibility || isFetchingEligibility) {
      return true;
    }
    if (isErrorEligibility) {
      return true;
    }
    if (isSuccessEligibility) {
      return false;
    }
    return true;
  };
  return (
    <Box sx={{ my: 3, border: '1px solid #f0f0f0', py: 2 }}>
      <Typography
        textAlign="center"
        variant="h5"
        sx={{ mb: 3 }}
      >
        REVIEWS
      </Typography>

      {isSuccess && !data?.data?.reviews?.length && (
        <Box
          sx={{
            my: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/imgs/no-review-found.png"
            alt="No reviews were found"
            sx={{
              width: '60vw',
              height: 150,
              objectFit: 'contain'
            }}
          />
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PrimaryButton
          onClick={toggleForm}
          sx={checkEligible ? { display: 'none' } : { display: 'block' }}
        >
          Post a review
        </PrimaryButton>
        {!reviewCheckData?.status && (
          <Typography>
            {errorReviewCheck?.data?.message ?? ''}
          </Typography>
        )}
        {isSuccessEligibility && !isErrorEligibility && (
          <Typography>You are eligible for writing a review</Typography>
        )}
      </Box>
      {isSuccess && data?.data?.reviews?.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3, px: { xs: 4, md: 40 } }}>
          {data?.data?.reviews?.map((review) => (
            <Box
              key={review.userId}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                p: 1,
                boxShadow:
                  'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'
              }}
            >
              <Box>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ pointerEvents: 'none', minWidth: '5px', p: 0, px: 0.2 }}
                >
                  {review?.rating}
                  <StarIcon sx={{ width: 15, px: 0, ml: 0, mr: 0 }} />
                </Button>
                <Typography sx={{ my: 2 }}>{review.description}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  '&>p': {
                    color: '#878787'
                  }
                }}
              >
                <Typography>{`${review.userName}`}</Typography>
                <Typography>
                  {`Reviewed on ${new Date(review?.createdOn)?.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}`}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
      <AddReviewForm
        open={open}
        toggleForm={toggleForm}
      />
    </Box>
  );
}

export default ProductReview;
