/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, Box, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { PrimaryButton, SecondaryButton } from '../../../MaterialUiConfig/styled';
import { useUserLoginMutation } from '../../../redux/api/authApiSlice';
import { setToken } from '../../../redux/reducers/authSlice';
import { setToast } from '../../../redux/reducers/toastSlice';

function UserLoginForm() {
  const [formError, setFormError] = useState('');
  const [btnText, setBtnText] = useState('Login');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userLogin, { isLoading }] = useUserLoginMutation();

  const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email address').required('Please enter you email '),
    password: yup.string().required('Please enter you password').min(3)
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
    if (!isLoading) {
      try {
        setBtnText('Loading...');
        const res = await userLogin(data).unwrap();
        if (res.status === 'success') {
          dispatch(setToast({ data: res, open: true }));
          setFormError('');
          await dispatch(setToken(res));
          navigate('/');
        }
      } catch (err) {
        setBtnText('Login');
        setFormError(err.data.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '100vw',
        minHeight: '100vh',
        backgroundColor: '#1098ad',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: { xs: '50vw', md: 'max-content' },
          maxWidth: { md: '30vw' },
          p: 5,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Typography variant="h4" component="h1" sx={{ mb: '2rem', textAlign: 'center' }}>
          Login
        </Typography>
        <Typography
          variant="subtitle1"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center', color: '#98a6ad' }}
        >
          Enter your email and password to continue
        </Typography>
        {formError && (
          <Alert sx={{ mb: 5 }} severity="error">
            {formError}!
          </Alert>
        )}
        <TextField
          sx={{ mb: 2 }}
          label="Email"
          fullWidth
          required
          type="email"
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
          {...register('email')}
        />
        <TextField
          sx={{ mb: 2 }}
          label="Password"
          fullWidth
          required
          type="password"
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          {...register('password')}
        />
        <PrimaryButton sx={{ width: '100%', p: 1, mx: 'auto' }} type="submit">
          {btnText}
        </PrimaryButton>
        <SecondaryButton
          component={Link}
          to="/otplogin"
          disabled={isLoading}
          sx={{ width: '100%', p: 1, mx: 'auto' }}
        >
          Login with OTP
        </SecondaryButton>
        <Typography sx={{ mt: 3, color: '#862e9c' }} variant="subtitle2">
          New to GameStop ?
        </Typography>
        <Box
          component={Link}
          to="/register"
          sx={isLoading ? { pointerEvents: 'none', color: '#101010' } : { color: '#101010' }}
        >
          <Typography variant="subtitle2" sx={{ m: 0 }}>
            Create your account
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default UserLoginForm;
