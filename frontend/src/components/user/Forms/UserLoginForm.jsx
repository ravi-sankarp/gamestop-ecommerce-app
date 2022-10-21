/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, Box, Divider, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { PrimaryButton, SecondaryButton } from '../../../MaterialUiConfig/styled';
import { useUserLoginMutation } from '../../../redux/api/authApiSlice';
import { setToken } from '../../../redux/reducers/authSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import GoogleLoginComponent from './GoogleLoginComponent';

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
          await dispatch(setToken(res));
          dispatch(setToast({ data: res, open: true }));
          setFormError('');
          navigate(-1);
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
          width: { xs: '70vw', sm: '40vw', md: '20vw' },
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
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center' }}
        >
          Login
        </Typography>
        <Typography
          variant="subtitle1"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center', color: '#98a6ad' }}
        >
          Login to continue
        </Typography>
        {formError && (
          <Alert
            sx={{ mb: 5 }}
            severity="error"
          >
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
        <Box
          component={Link}
          to="/forgotpassword"
          sx={
            isLoading
              ? { pointerEvents: 'none', color: 'rgba(0,0,0,0.6)' }
              : { color: 'rgba(0,0,0,0.9)' }
          }
        >
          <Typography
            variant="subtitle2"
            sx={{ m: 0 }}
          >
            Forgot your Password ?
          </Typography>
        </Box>
        <PrimaryButton
          sx={{ width: { xs: '10rem', md: '100%' }, p: 1, mx: 'auto' }}
          type="submit"
        >
          {btnText}
        </PrimaryButton>
        <Box sx={{ position: 'relative' }}>
          <Divider />
          <Typography
            sx={{
              background: '#fff',
              px: 1,
              position: 'absolute',
              left: '50%',
              bottom: '-11px',
              transform: 'translateX(-50%)',
              zIndex: 100
            }}
          >
            or
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SecondaryButton
            component={Link}
            to="/otplogin"
            disabled={isLoading}
            sx={{
              width: '300px',
              p: 1,
              px: 2,
              mx: 'auto',
              whiteSpace: 'nowrap',
              height: '38px',
              fontSize: '14px',
              boxShadow: '0 0 0 1px #dadce0',
              '&:hover': {
                boxShadow: '0 0 0 1px #d2e3fc',
                backgroundColor: 'rgba(66,133,244,.04)'
              }
            }}
          >
            Sign in with OTP
          </SecondaryButton>
          <GoogleLoginComponent
            setError={setFormError}
            text="signin_with"
            width={300}
          />
        </Box>
        <Typography
          sx={{ mt: 3, color: '#862e9c' }}
          variant="subtitle2"
        >
          New to GameStop ?
        </Typography>
        <Box
          component={Link}
          to="/register"
          sx={
            isLoading ? { pointerEvents: 'none', color: 'rgba(0,0,0,0.6)' } : { color: '#101010' }
          }
        >
          <Typography
            variant="subtitle2"
            sx={{ m: 0 }}
          >
            Create your account
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default UserLoginForm;
