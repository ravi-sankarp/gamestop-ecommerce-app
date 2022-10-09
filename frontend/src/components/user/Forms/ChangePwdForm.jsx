/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { Alert, Box, Grid, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { useChangeUserPasswordMutation } from '../../../redux/api/userApiSlice';
import useSuccessHandler from '../../../hooks/useSuccessHandler';
import { setToken } from '../../../redux/reducers/authSlice';

function ChangePwdForm() {
  const [isChangePwd, setIsChangePwd] = useState(false);
  const [btnText, setBtnText] = useState('Update');
  const [formError, setFormError] = useState('');
  const [updatePassword, { isLoading }] = useChangeUserPasswordMutation();

  const successToast = useSuccessHandler();
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    confirmPassword: yup
      .string()
      .required('Please enter your old password ')
      .min(4, 'Password must be atleast 4 characters'),
    newPassword: yup
      .string()
      .required('Please enter your old password ')
      .min(4, 'Password must be atleast 4 characters'),
    confirmNewPassword: yup
      .string()
      .required('Please enter your old password ')
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

  const toggleIsChangePwd = () => {
    setIsChangePwd((current) => !current);
  };

  const onSubmitHandler = async (updateData) => {
    if (!isLoading) {
      try {
        setBtnText('Loading...');
        const res = await updatePassword(updateData).unwrap();
        await dispatch(setToken(res));

        setFormError('');
        setBtnText('Update Data');
        toggleIsChangePwd();
        successToast(res);
      } catch (err) {
        setBtnText('Update Data');
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography sx={{ mb: '2rem', textAlign: 'left' }}>Change Password</Typography>

          <Typography
            onClick={toggleIsChangePwd}
            sx={{ color: '#2874f0', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Edit
          </Typography>
        </Box>

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
              label="Confirm Old Password"
              fullWidth
              required
              type="password"
              disabled={!isChangePwd}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
              {...register('confirmPassword')}
            />
          </Grid>
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
              disabled={!isChangePwd}
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
              disabled={!isChangePwd}
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
          disabled={!isChangePwd}
          sx={{ width: '100%', p: 1, mx: 'auto', mb: 0 }}
          type="submit"
        >
          {btnText}
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default ChangePwdForm;
