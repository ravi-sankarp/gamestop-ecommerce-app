/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Alert, Box, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { PrimaryButton, SecondaryButton } from '../../../MaterialUiConfig/styled';
import { setToast } from '../../../redux/reducers/toastSlice';
import { setToken } from '../../../redux/reducers/authSlice';
import {
  useUserRequestOtpMutation,
  useUserVerifyOtpMutation
} from '../../../redux/api/authApiSlice';

function UserOtpLoginForm() {
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formError, setFormError] = useState('');
  const [formSucess, setFormSuccess] = useState('');
  const [btnText, setBtnText] = useState('Send OTP');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestOtp, { isLoading: isLoadingRequest }] = useUserRequestOtpMutation();
  const [verifyOtp, { isLoading: isLoadingOtpVerify }] = useUserVerifyOtpMutation();
  const phoneNumberSchema = yup.object().shape({
    phoneNumber: yup
      .string()
      .required('Please enter your Phone Number ')
      .matches(/^[6-9]\d{9}$/, 'Enter a valid phone number')
  });
  const otpSchema = yup.object().shape({
    code: yup
      .string()
      .required('Please enter your OTP')
      .min(4, 'OTP is of 4 characters')
      .typeError('Please enter your OTP')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(phoneNumberSchema),
    mode: 'onChange'
  });

  const {
    register: otpLogin,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors }
  } = useForm({
    resolver: yupResolver(otpSchema),
    mode: 'onChange'
  });

  // Request Otp Handler
  const onSubmitHandler = async (data) => {
    if (!isLoadingRequest) {
      try {
        setBtnText('Loading...');
        const res = await requestOtp(data).unwrap();
        setFormError('');
        setPhoneNumber(data.phoneNumber);
        setOtpSent(true);
        setSeconds(0);
        setMinutes(2);
        setFormSuccess(res.message);
        setBtnText('Verify');
      } catch (err) {
        setBtnText('Send OTP');
        setFormError(err.data.message);
      }
    }
  };

  // Verify OTP handler
  const onSubmitOtpHandler = async (data) => {
    if (!isLoadingOtpVerify) {
      try {
        setBtnText('Loading...');
        const res = await verifyOtp({ phoneNumber, code: `${data.code}` }).unwrap();
        setFormError('');
        dispatch(setToast({ data: res, open: true }));
        await dispatch(setToken(res));
        navigate('/');
      } catch (err) {
        setBtnText('Verify OTP');
        setFormError(err.data.message);
      }
    }
  };

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [otpSent, seconds, minutes]);

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
      {otpSent || (
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
            OTP Login
          </Typography>
          <Typography
            variant="subtitle1"
            component="h1"
            sx={{ mb: '2rem', textAlign: 'center', color: '#98a6ad' }}
          >
            Enter your mobile number to continue
          </Typography>
          {formSucess && (
            <Alert sx={{ mb: 5 }} severity="info">
              {formSucess}!
            </Alert>
          )}

          {formError && (
            <Alert sx={{ mb: 5 }} severity="error">
              {formError}!
            </Alert>
          )}

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
          <Typography sx={{ mt: 3, color: '#862e9c' }} variant="subtitle2">
            New to GameStop ?
          </Typography>
          <Link to="/register">
            <Typography variant="subtitle2" sx={{ m: 0, color: '#000' }}>
              Create your account
            </Typography>{' '}
          </Link>
        </Box>
      )}
      {otpSent && (
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
          onSubmit={handleOtpSubmit(onSubmitOtpHandler)}
        >
          <Typography variant="h4" component="h1" sx={{ mb: '2rem', textAlign: 'center' }}>
            Login with OTP
          </Typography>
          <Typography
            variant="subtitle1"
            component="h1"
            sx={{ mb: '2rem', textAlign: 'center', color: '#98a6ad' }}
          >
            Enter OTP to continue
          </Typography>
          {formSucess && (
            <Alert sx={{ mb: 5 }} severity="info">
              {formSucess}!
            </Alert>
          )}
          {formError && (
            <Alert sx={{ mb: 5 }} severity="error">
              {formError}!
            </Alert>
          )}

          <TextField
            sx={{ mb: 2 }}
            label="Otp"
            fullWidth
            required
            type="number"
            error={!!otpErrors.code}
            helperText={otpErrors.code ? otpErrors.code.message : ''}
            {...otpLogin('code')}
          />

          <PrimaryButton sx={{ p: 1, mx: 'auto', letterSpacing: 1 }} type="submit">
            Verify
          </PrimaryButton>
          <Box>
            {minutes === 0 && seconds === 0 ? (
              <SecondaryButton onClick={() => onSubmitHandler({ phoneNumber })}>
                Resend OTP
              </SecondaryButton>
            ) : (
              <>
                <Typography variant="subtitle2">
                  Resend OTP in
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </Typography>
                <SecondaryButton disabled>Resend OTP</SecondaryButton>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default UserOtpLoginForm;
