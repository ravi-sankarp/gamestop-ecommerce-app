/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, Box, Divider, Grid, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { SecondaryButton } from '../../../MaterialUiConfig/styled';
import { useUserRegisterMutation } from '../../../redux/api/authApiSlice';
import { setToken } from '../../../redux/reducers/authSlice';
import { setToast } from '../../../redux/reducers/toastSlice';
import GoogleLoginComponent from './GoogleLoginComponent';

function UserRegisterForm() {
  const [formError, setFormError] = useState('');
  const [btnText, setBtnText] = useState('Register');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userLogin, { isLoading }] = useUserRegisterMutation();

  const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email address').required('Please enter you email '),
    firstName: yup
      .string()
      .required('Please enter your First Name ')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as first name ')
      .min(4, 'First Name must be atleast 4 characters'),
    lastName: yup
      .string()
      .required('Please enter you last name')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as last name ')
      .min(1, 'Last name must be atleast 1 character'),
    phoneNumber: yup
      .string()
      .matches(/^[6-9]\d{9}$/, 'Enter a valid phone number')
      .required('Please enter your phone number'),
    password: yup
      .string()
      .required('Please enter you password')
      .min(3, 'Password must be atleast 3 characters'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    referralCode: yup.string()
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
        dispatch(setToast({ data: res, open: true }));
        setFormError('');
        await dispatch(setToken(res));
        navigate(-2);
      } catch (err) {
        setBtnText('Register');
        setFormError(err.data.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '100vw',
        minHeight: { xs: 'max-content', md: '100vh' },
        backgroundColor: '#1098ad',
        justifyContent: 'center',
        alignItems: { xs: 'flex-start', md: 'center' },
        py: { xs: 5, md: 0 }
      }}
    >
      <Box
        sx={{
          width: { xs: '70vw', sm: '60vw', md: '50vw' },
          maxWidth: { md: '30vw' },
          p: { xs: 0, md: 5 },
          px: { xs: 4 },
          py: { xs: 4, sm: 2 },
          textAlign: 'center',
          backgroundColor: '#ffffff',
          minHeight: { xs: 'max-content', md: '50vh' },
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
          Sign Up
        </Typography>
        <GoogleLoginComponent
          text="signup_with"
          width={250}
          setError={setFormError}
        />
        <Box sx={{ position: 'relative', my: 4, mb: 5 }}>
          <Divider />
          <Typography
            sx={{
              background: '#fff',
              px: 1,
              position: 'absolute',
              left: '50%',
              bottom: '-11px',
              transform: 'translateX(-50%)',
              zIndex: 2
            }}
          >
            or
          </Typography>
        </Box>

        {/* <Typography
          variant="subtitle1"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center', color: '#98a6ad' }}
        >
          Enter your details to continue
        </Typography> */}
        {formError && (
          <Alert
            sx={{ mb: 5 }}
            severity="error"
          >
            {formError}!
          </Alert>
        )}
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              label="First Name"
              fullWidth
              required
              type="text"
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ''}
              {...register('firstName')}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              label="Last Name"
              fullWidth
              required
              type="text"
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ''}
              {...register('lastName')}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              label="Email"
              fullWidth
              required
              type="email"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
              {...register('email')}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              label="Phone Number"
              fullWidth
              required
              type="number"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
              {...register('phoneNumber')}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              label="Password"
              fullWidth
              required
              type="password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              {...register('password')}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              label="Confirm Password"
              fullWidth
              required
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
              {...register('confirmPassword')}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Typography
              textAlign="left"
              variant="subtitle2"
              sx={{ color: 'rgba(0,0,0,0.5)', mb: 1 }}
            >
              Have a referral Code ?
            </Typography>
            <TextField
              size="small"
              sx={{ mb: 2 }}
              label="Referral Code"
              fullWidth
              required
              type="text"
              error={!!errors.referralCode}
              helperText={errors.referralCode ? errors.referralCode.message : ''}
              {...register('referralCode')}
            />
          </Grid>
        </Grid>
        <SecondaryButton
          sx={{ width: '250px', p: 1, mx: 'auto' }}
          type="submit"
        >
          {btnText}
        </SecondaryButton>
        <Typography
          sx={{ mt: 3, color: '#862e9c' }}
          variant="subtitle2"
        >
          Already have an account ?
        </Typography>
        <Box
          component={Link}
          to="/login"
          sx={isLoading ? { pointerEvents: 'none' } : {}}
        >
          <Typography
            variant="subtitle2"
            sx={{ m: 0, color: '#101010' }}
          >
            Login
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default UserRegisterForm;
