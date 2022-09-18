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
import { PrimaryButton } from '../../../../MaterialUiConfig/styled';
import { useAddNewCategoryMutation } from '../../../../redux/api/adminApiSlice';
import { setToast } from '../../../../redux/reducers/toastSlice';

function CategoryForm({ close }) {
  const [formError, setFormError] = useState('');
  const [text, setText] = useState('Add Category');
  const dispatch = useDispatch();
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Please provide the category name ')
      .min(3, 'Category Name must be atleast 3 character'),

    description: yup.string().required('Please Provide description of the category').min(10),
    bannerImg: yup
      .mixed()
      .typeError('Please select a valid image')
      .test('required', 'Selected file is not an image', (value) =>
        Object.entries(value).every((img) => SUPPORTED_FORMATS.includes(img[1].type))
      )
      .test('required', 'Please select an image', (value) => value.length)
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const [addNewCategory, { isLoading }] = useAddNewCategoryMutation();
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
        setText('Adding Category...');
        const res = await addNewCategory(form).unwrap();
        dispatch(setToast({ data: res, open: true }));
        close();
      } catch (err) {
        setText('Add Category');
        setFormError(err.data.message);
      }
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
      {formError && (
        <Alert sx={{ mb: 5, textAlign: 'center' }} severity="error">
          {formError}!
        </Alert>
      )}

      <TextField
        sx={{ mb: 2 }}
        label="Category Name"
        fullWidth
        required
        type="text"
        error={!!errors.name}
        helperText={errors.name ? errors.name.message : ''}
        {...register('name')}
      />

      <TextField
        sx={{ mb: 2 }}
        label="Category Description"
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
        fullWidth
        required
        focused
        label="Banner Image"
        type="file"
        error={!!errors.bannerImg}
        helperText={errors.bannerImg ? errors.bannerImg.message : ''}
        {...register('bannerImg')}
      />

      <PrimaryButton sx={{ width: '200px', mx: 'auto', p: 1, display: 'block' }} type="submit">
        {text}
      </PrimaryButton>
    </Box>
  );
}

export default CategoryForm;
