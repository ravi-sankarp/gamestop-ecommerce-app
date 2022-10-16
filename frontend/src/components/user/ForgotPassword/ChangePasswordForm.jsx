/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { Alert, Box, Grid, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import useSuccessHandler from '../../../hooks/useSuccessHandler';
import { setToken } from '../../../redux/reducers/authSlice';
import { useUserChangePasswordMutation } from '../../../redux/api/authApiSlice';

function ChangePasswordForm({ phoneNumber }) {
  const [btnText, setBtnText] = useState('Change Password');
  const [formError, setFormError] = useState('');
  const [updatePassword, { isLoading }] = useUserChangePasswordMutation();

  const navigate = useNavigate();

  const successToast = useSuccessHandler();
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .required('Please enter your new password ')
      .min(4, 'Password must be atleast 4 characters'),
    confirmNewPassword: yup
      .string()
      .required('Confirm your new Password ')
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
      .min(4, 'Password must be atleast 4 characters')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmitHandler = async (updateData) => {
    if (!isLoading) {
      try {
        setBtnText('Loading...');
        const res = await updatePassword({ phoneNumber, ...updateData }).unwrap();
        await dispatch(setToken(res));

        setFormError('');
        setBtnText('Change Password');
        successToast(res);
        navigate('/');
      } catch (err) {
        setBtnText('Change Password');
        setFormError(err.data.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        mt: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '23rem'
      }}
    >
      <Box
        sx={{
          width: { xs: '50vw', md: '50vw' },
          maxWidth: { md: '30vw' },
          p: 5,
          mb: 0,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          display: 'flex',
          flexDirection: 'column'
        }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center' }}
        >
          Change Password
        </Typography>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              sx={{ mb: 2 }}
              label="New Password"
              fullWidth
              required
              type="password"
              error={!!errors.newPassword}
              helperText={errors.newPassword ? errors.newPassword.message : ''}
              {...register('newPassword')}
            />
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextField
              sx={{ mb: 2 }}
              label="Confirm New Password"
              fullWidth
              required
              type="password"
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword ? errors.confirmNewPassword.message : ''}
              {...register('confirmNewPassword')}
            />
          </Grid>
        </Grid>
        {formError && (
          <Alert
            sx={{ mb: 5 }}
            severity="error"
          >
            {`${formError}!`}
          </Alert>
        )}
        <PrimaryButton
          sx={{ width: '100%', p: 1, mx: 'auto', mb: 0 }}
          type="submit"
        >
          {btnText}
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default ChangePasswordForm;
