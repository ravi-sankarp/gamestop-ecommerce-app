/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Alert, Box, TextField } from '@mui/material';
import { useEditCouponMutation } from '../../../redux/api/adminApiSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';

function EditCoupon({ couponData, close }) {
  const [formError, setFormError] = useState('');
  const [text, setText] = useState('Edit Coupon');
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    code: yup
      .string()
      .uppercase()
      .required('Please Enter a coupon code')
      .min(5, 'Please enter atleast 5 characters'),
    minPrice: yup
      .number()
      .required()
      .typeError('Minimum Purchase must be a number')
      .min(1000, 'Minimum Purchase amount must be atleast 1000'),
    discount: yup
      .number()
      .required()
      .typeError('Discount Percentage must be a number')
      .min(1, 'Discount Percentage must be atleast 1 percentage')
      .max(99, 'Discount Percentage must be a maximum of 99 percentage'),
    expiryDate: yup
      .date()
      .required()
      .typeError('Please select a date')
      .min(
        new Date(),
        `Please select a date after ${new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}`
      )
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const [editCoupon, { isLoading }] = useEditCouponMutation();

  const onSubmitHandler = async (data) => {
    if (!isLoading) {
      try {
        setFormError('');
        setText('Editing Coupon...');
        const res = await editCoupon({ id: couponData._id, data }).unwrap();
        dispatch(setToast({ data: res, open: true }));
        close();
      } catch (err) {
        setText('Edit Offer');
        setFormError(err.data.message);
      }
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      {formError && (
        <Alert
          sx={{ mb: 5, textAlign: 'center' }}
          severity="error"
        >
          {formError}!
        </Alert>
      )}

      <TextField
        sx={{ mb: 2 }}
        label="Coupon Code"
        fullWidth
        required
        name="code"
        type="text"
        defaultValue={couponData.code}
        error={!!errors.code}
        helperText={errors.code ? errors.code.message : ''}
        {...register('code')}
      />
      <TextField
        sx={{ mb: 2 }}
        label="Minimum Purchase"
        fullWidth
        required
        name="minPrice"
        type="number"
        defaultValue={couponData.minPrice}
        error={!!errors.minPrice}
        helperText={errors.minPrice ? errors.minPrice.message : ''}
        {...register('minPrice')}
      />
      <TextField
        sx={{ mb: 2 }}
        label="Discount Percentage"
        fullWidth
        required
        defaultValue={couponData.discount}
        name="discount"
        type="number"
        error={!!errors.discount}
        helperText={errors.discount ? errors.discount.message : ''}
        {...register('discount')}
      />
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        required
        label="Coupon Expiry Date"
        inputProps={{ min: new Date().toLocaleDateString('en-ca') }}
        name="expiryDate"
        type="date"
        defaultValue={new Date(couponData.expiryDate).toLocaleDateString('en-ca')}
        error={!!errors.expiryDate}
        helperText={errors.expiryDate ? errors.expiryDate.message : ''}
        {...register('expiryDate')}
      />

      <PrimaryButton
        sx={{ width: '200px', mx: 'auto', p: 1, display: 'block' }}
        type="submit"
      >
        {text}
      </PrimaryButton>
    </Box>
  );
}

export default EditCoupon;
