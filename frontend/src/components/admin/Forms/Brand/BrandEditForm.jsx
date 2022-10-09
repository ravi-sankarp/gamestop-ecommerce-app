/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Alert, Box, TextField } from '@mui/material';
import { PrimaryButton } from '../../../../MaterialUiConfig/styled';
import { useEditBrandMutation } from '../../../../redux/api/adminApiSlice';
import { setToast } from '../../../../redux/reducers/toastSlice';

function BrandEditForm({ brandData, close }) {
  const [formError, setFormError] = useState('');
  const [text, setText] = useState('Update Brand');
  const dispatch = useDispatch();
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
  const schema = yup.object().shape({
    name: yup
      .string()
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as Brand name ')
      .min(3, 'Brand Name must be atleast 3 character'),

    description: yup.string().min(10),
    bannerImg: yup
      .mixed()
      .typeError('Please select a valid image')
      .test('fileType', 'Selected file is not an image', (value) =>
        Object.entries(value).every((img) => SUPPORTED_FORMATS.includes(img[1].type))
      )
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const [editBrand, { isLoading }] = useEditBrandMutation();
  const onSubmitHandler = async (data) => {
    if (!isLoading) {
      const form = new FormData();
      for (const key of Object.keys(data)) {
        if (key === 'bannerImg') {
          form.append(key, data[key][0]);
        } else {
          form.append(key, data[key]);
        }
      }

      try {
        setFormError('');
        setText('Updating Brand...');
        const res = await editBrand({ id: brandData._id, data: form }).unwrap();
        dispatch(setToast({ data: res, open: true }));
        close();

        console.log(res);
      } catch (err) {
        setText('Update Brand');
        setFormError(err.data.message);
      }
    }
  };
  useEffect(() => {
    const newProduct = { ...brandData };
    newProduct.bannerImg = [];
    reset(newProduct);
  }, [brandData, reset]);
  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
      {formError && (
        <Alert sx={{ mb: 5, textAlign: 'center' }} severity="error">
          {formError}!
        </Alert>
      )}

      <TextField
        sx={{ mb: 2 }}
        label="Brand Name"
        fullWidth
        required
        type="text"
        error={!!errors.name}
        helperText={errors.name ? errors.name.message : ''}
        {...register('name')}
      />

      <TextField
        sx={{ mb: 2 }}
        label="Brand Description"
        fullWidth
        multiline
        maxRows={4}
        required
        name="description"
        type="text"
        error={!!errors.description}
        helperText={errors.description ? errors.description.message : ''}
        {...register('description')}
      />

      <TextField
        sx={{ mb: 2 }}
        accept=".jpg, .jpeg, .png"
        name="bannerImg"
        label="Banner Image"
        focused
        fullWidth
        required
        type="file"
        error={!!errors.bannerImg}
        helperText={errors.bannerImg ? errors.bannerImg.message : ''}
        {...register('bannerImg')}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <img width="100px" height="100px" src={brandData.bannerImg.imgUrl} alt={brandData.name} />
      </Box>
      <PrimaryButton sx={{ width: '200px', mx: 'auto', p: 1, display: 'block' }} type="submit">
        {text}
      </PrimaryButton>
    </Box>
  );
}

export default BrandEditForm;
