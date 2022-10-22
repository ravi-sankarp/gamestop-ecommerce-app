/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Rating,
  TextField,
  Typography
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import * as yup from 'yup';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { useAddNewReviewMutation } from '../../../redux/api/userApiSlice';
import useSuccessHandler from '../../../hooks/useSuccessHandler';

function AddReviewForm({ open, toggleForm, refetch }) {
  const [rating, setRating] = useState();
  const [ratingError, setRatingError] = useState();
  const [formError, setFormError] = useState('');
  const [btnText, setBtnText] = useState('Add Review');
  const { id } = useParams();
  const successHandler = useSuccessHandler();
  const [addReview, { isLoading }] = useAddNewReviewMutation();
  const schema = yup.object().shape({
    description: yup
      .string()
      .required('Please enter description for the review')
      .min(10, 'Product review description must be atleast 10 characters')
  });
  const {
    register,
    handleSubmit,

    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmitHandler = async (data) => {
    if (!rating) {
      setRatingError('Please choose the rating');
      return;
    }
    if (!isLoading) {
      try {
        setBtnText('Loading...');
        const res = await addReview({
          productId: id,
          rating,
          description: data.description
        }).unwrap();
        successHandler(res);
        refetch();
        setFormError('');
        toggleForm();
        setBtnText('Add Review');
      } catch (err) {
        setFormError(err.data.message);
        setBtnText('Add Review');
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={toggleForm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ minWidth: '52vw' }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex' }}>
          <Typography
            variant="h6"
            align="center"
            component="div"
            style={{ flexGrow: 1 }}
          >
            Write a review
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            onClick={toggleForm}
            sx={{ fontSize: { xs: 10 }, p: 0, m: 0, border: 0, justifySelf: 'flex-end' }}
          >
            <CloseOutlinedIcon />
          </Button>
        </Box>
      </DialogTitle>
      <Divider />
      <Box>
        <Box
          sx={{
            backgroundColor: '#ffffff',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 5,
            px: 10
          }}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          {formError && (
            <Alert
              sx={{ mb: 5 }}
              severity="error"
            >
              {formError}!
            </Alert>
          )}

          <TextField
            sx={{ mb: 2, width: '30vw' }}
            label="Description"
            variant="filled"
            multiline
            rows={3}
            required
            type="text"
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ''}
            {...register('description')}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6">Rating</Typography>

            <Rating
              value={Number(rating)}
              onChange={(_, value) => setRating(value)}
              precision={0.5}
              name="rating"
            />

            <Typography
              variant="subtitle2"
              color="red"
            >
              {ratingError || ''}
            </Typography>
          </Box>
          <PrimaryButton
            sx={{ padding: '8px 20px', mx: 'auto' }}
            type="submit"
          >
            {btnText}
          </PrimaryButton>
        </Box>
      </Box>
    </Dialog>
  );
}

export default AddReviewForm;
