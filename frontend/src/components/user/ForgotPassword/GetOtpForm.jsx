/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { Alert, Box, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { useUserForgotPasswordMutation } from '../../../redux/api/authApiSlice';

function GetOtpForm({ handleNext, setPhoneNumber }) {
  const [formError, setFormError] = useState('');
  const [btnText, setBtnText] = useState('Send OTP');
  const [requestOtp, { isLoading: isLoadingRequest }] = useUserForgotPasswordMutation();
  const phoneNumberSchema = yup.object().shape({
    phoneNumber: yup
      .string()
      .required('Please enter your Phone Number ')
      .matches(/^[6-9]\d{9}$/, 'Enter a valid phone number'),
    email: yup.string().email('Enter a valid email address').required('Please enter you email ')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(phoneNumberSchema),
    mode: 'onChange'
  });

  // Request Otp Handler
  const onSubmitHandler = async (data) => {
    if (!isLoadingRequest) {
      try {
        setBtnText('Loading...');
        await requestOtp(data).unwrap();
        setFormError('');
        setPhoneNumber(data.phoneNumber);
        handleNext();
        setBtnText('Send OTP');
    } catch (err) {
        setBtnText('Send OTP');
        setFormError(err.data.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
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
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center' }}
        >
          Forgot Password
        </Typography>
        <Typography
          variant="subtitle1"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center', color: '#98a6ad' }}
        >
          Enter your mobile number and email to continue
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
          label="Mobile Number"
          fullWidth
          required
          type="number"
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
          {...register('phoneNumber')}
        />

        <PrimaryButton
          sx={{ p: 1.2, mx: 'auto', letterSpacing: 1, lineHeight: '1.5em' }}
          type="submit"
        >
          {btnText}
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default GetOtpForm;
