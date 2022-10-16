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
import { Alert, Box, MenuItem, TextField } from '@mui/material';
import { useAddNewOfferMutation } from '../../../redux/api/adminApiSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';

function AddProductOfferForm({ close, products }) {
  const [formError, setFormError] = useState('');
  const [text, setText] = useState('Add Product Offer');
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    id: yup.string().required('Please select a Product '),
    discount: yup
      .number()
      .required()
      .typeError('Discount Percentage must be a number')
      .min(1, 'Product Offer must be atleast 1 percentage')
      .max(99, 'Product Offer must be a maximum of 99 percentage')
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const [addNewProductOffer, { isLoading }] = useAddNewOfferMutation();
  const onSubmitHandler = async (data) => {
    if (!isLoading) {
      try {
        setFormError('');
        setText('Adding Offer...');
        const res = await addNewProductOffer({ ...data, type: 'Product Offer' }).unwrap();
        dispatch(setToast({ data: res, open: true }));
        close();
      } catch (err) {
        setText('Add Offer');
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
        label="Select Product Name"
        name="id"
        select
        fullWidth
        required
        defaultValue={products[0]._id.toString()}
        type="text"
        error={!!errors.id}
        helperText={errors.id ? errors.id.message : ''}
        {...register('id')}
      >
        {products?.map((Product) => (
          <MenuItem
            key={Product.name}
            value={`${Product._id}`}
          >
            {Product.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        sx={{ mb: 2 }}
        label="Discount Percentage"
        fullWidth
        required
        name="discount"
        type="number"
        error={!!errors.discount}
        helperText={errors.discount ? errors.discount.message : ''}
        {...register('discount')}
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

export default AddProductOfferForm;
