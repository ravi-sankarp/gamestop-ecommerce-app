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
import { useAddNewBannerrMutation } from '../../../redux/api/adminApiSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';

function AddNewBanner({ close }) {
  const [formError, setFormError] = useState('');
  const [text, setText] = useState('Add Bannner');
  const dispatch = useDispatch();
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
  const schema = yup.object().shape({
    title: yup
      .string()
      .required('Please provide the banner name ')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as banner name ')
      .min(5, 'Banner title must be atleast 5 character'),

    description: yup.string().required('Please provide a desciption for the banner').min(5),
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
  const [addNewBanner, { isLoading }] = useAddNewBannerrMutation();
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
        setText('Loading ...');
        const res = await addNewBanner(form).unwrap();
        dispatch(setToast({ data: res, open: true }));
        close();
      } catch (err) {
        setText('Add Banner');
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
        label="Brand Title"
        fullWidth
        required
        type="text"
        error={!!errors.title}
        helperText={errors.title ? errors.title.message : ''}
        {...register('title')}
      />

      <TextField
        sx={{ mb: 2 }}
        label="Banner Description"
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

      <PrimaryButton
        sx={{ width: '200px', mx: 'auto', p: 1, display: 'block' }}
        type="submit"
      >
        {text}
      </PrimaryButton>
    </Box>
  );
}

export default AddNewBanner;
