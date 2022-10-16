/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Alert, Box, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { PrimaryButton, SecondaryButton } from '../../../MaterialUiConfig/styled';
import {
  useUserRequestOtpMutation,
  useUserVerifyOtpMutation
} from '../../../redux/api/authApiSlice';

function VerifyOtpForm({ handleNext, phoneNumber }) {
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('Enter the OTP sent to your mobile number');
  const [btnText, setBtnText] = useState('Verify OTP');
  const [resendBtnText, setResendBtnText] = useState('Resend OTP');
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);
  const [verifyOtp, { isLoading: isLoadingOtpVerify }] = useUserVerifyOtpMutation();
  const [requestOtp, { isLoading: isLoadingRequest }] = useUserRequestOtpMutation();

  const otpSchema = yup.object().shape({
    code: yup
      .string()
      .required('Please enter your OTP')
      .min(4, 'OTP is of 4 characters')
      .typeError('Please enter your OTP')
  });

  const {
    register: otpLogin,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors }
  } = useForm({
    resolver: yupResolver(otpSchema),
    mode: 'onChange'
  });

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
  }, [seconds, minutes]);

  // Verify OTP handler
  const onSubmitOtpHandler = async (data) => {
    if (!isLoadingOtpVerify) {
      try {
        setBtnText('Loading...');
        await verifyOtp({ phoneNumber, code: `${data.code}`, method: 'Forgot Password' }).unwrap();
        setFormError('');
        handleNext();
      } catch (err) {
        setBtnText('Verify OTP');
        setFormError(err.data.message);
      }
    }
  };

  // Request resend Otp Handler
  const onSubmitHandler = async (data) => {
    if (!isLoadingRequest) {
      try {
        setResendBtnText('Loading...');
        await requestOtp(data);
        setFormError('');
        setResendBtnText('Resend OTP');
        setFormSuccess('OTP was resended');
         setSeconds(0);
         setMinutes(2);
      } catch (err) {
        setResendBtnText('Resend OTP');
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
        onSubmit={handleOtpSubmit(onSubmitOtpHandler)}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center' }}
        >
         Verify OTP
        </Typography>
        <Typography
          variant="subtitle1"
          component="h1"
          sx={{ mb: '2rem', textAlign: 'center', color: '#98a6ad' }}
        >
          Enter OTP to continue
        </Typography>
        {formSuccess && (
          <Alert
            sx={{ mb: 5 }}
            severity="info"
          >
            {formSuccess}
          </Alert>
        )}
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
          label="Otp"
          fullWidth
          required
          type="number"
          error={!!otpErrors.code}
          helperText={otpErrors.code ? otpErrors.code.message : ''}
          {...otpLogin('code')}
        />

        <PrimaryButton
          sx={{ p: 1, mx: 'auto', letterSpacing: 1 }}
          type="submit"
        >
          {btnText}
        </PrimaryButton>
        <Box>
          {minutes === 0 && seconds === 0 ? (
            <SecondaryButton onClick={() => onSubmitHandler({ phoneNumber })}>
              {resendBtnText}
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
    </Box>
  );
}

export default VerifyOtpForm;
