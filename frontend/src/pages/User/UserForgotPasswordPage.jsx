/* eslint-disable react/jsx-props-no-spreading */
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import { useState } from 'react';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import GetOtpForm from '../../components/user/ForgotPassword/GetOtpForm';
import VerifyOtpForm from '../../components/user/ForgotPassword/VerifyOtpForm';
import ChangePasswordForm from '../../components/user/ForgotPassword/ChangePasswordForm';

export default function UserForgotPasswordPage() {
  const stateData = useSelector((state) => state.auth.data);
  const [activeStep, setActiveStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(0);

  // if user is already logged in then navigate to home page
  if (stateData.token) {
    return <Navigate to="/" />;
  }

  const steps = ['Enter Email and Phone Number ', 'Verify OTP', 'Change password'];
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const checkWhichPage = () => {
    if (activeStep === 2) {
      return (
        <ChangePasswordForm
          handleNext={handleNext}
          phoneNumber={phoneNumber}
        />
      );
    }
    if (activeStep === 1) {
      return (
        <VerifyOtpForm
          handleNext={handleNext}
          phoneNumber={phoneNumber}
        />
      );
    }
    return (
      <GetOtpForm
        handleNext={handleNext}
        setPhoneNumber={setPhoneNumber}
      />
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '100vw',
        backgroundColor: '#1098ad',
        justifyContent: 'center',
        py: 5
      }}
    >
      <Box
        sx={{
          width: '80vw',
          maxWidth: { md: '70vw' },
          textAlign: 'center',
          backgroundColor: '#ffffff',
          minHeight: '50vh',
          padding: { xs: '20px 10px' },
          p: { md: 5 },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step
                key={label}
                {...stepProps}
              >
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {checkWhichPage()}
      </Box>
    </Box>
  );
}
