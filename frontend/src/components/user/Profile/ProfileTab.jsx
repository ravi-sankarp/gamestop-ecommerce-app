/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react';
import { Alert, Box, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import {
  useEditUserDetailsMutation,
  useGetUserDetailsQuery
} from '../../../redux/api/userApiSlice';
import useSuccessHandler from '../../../hooks/useSuccessHandler';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import HelmetMeta from '../../HelmetMeta';
import ChangePwdForm from '../Forms/ChangePwdForm';

function ProfileTab() {
  const { googleAuth } = useSelector((state) => state.auth.data);
  const [formError, setFormError] = useState('');
  const [isEdit, setisEdit] = useState(false);
  const [btnText, setBtnText] = useState('Update');
  const { data, isFetching, isLoading, isSuccess, isError, error } = useGetUserDetailsQuery();
  const [editDetails, { isLoading: isLoadingUserEdit }] = useEditUserDetailsMutation();

  const successToast = useSuccessHandler();
  const errorToast = useApiErrorHandler();

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
      .required('Please enter your phone number')
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  useEffect(() => {
    if (isError) {
      errorToast(error);
    }
  }, [isError, error, errorToast]);

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [reset, data]);

  const toggleIsEdit = () => {
    setisEdit((current) => !current);
  };

  const onSubmitHandler = async (updateData) => {
    if (!isLoadingUserEdit) {
      try {
        setBtnText('Loading...');
        const res = await editDetails(updateData).unwrap();
        setFormError('');
        setBtnText('Update Data');
        toggleIsEdit();
        successToast(res);
      } catch (err) {
        setBtnText('Update Data');
        setFormError(err.data.message);
      }
    }
  };

  if (isLoading || (isFetching && !isSuccess)) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,0%)',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <CircularProgress
          sx={{ overflow: 'hidden' }}
          color="primary"
        />
      </Box>
    );
  }

  return (
    <>
      <HelmetMeta title="User Profile | Gamestop" />
      <Grid
        container
        gap={3}
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          md={5}
        >
          <Box
            sx={{
              display: 'flex',
              mt: 5,
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            <Box
              sx={{
                width: { xs: '60vw', md: '50vw' },
                maxWidth: { md: '30vw' },
                minHeight: '22rem',
                p: 5,
                mb: 0,
                textAlign: 'center',
                backgroundColor: '#ffffff',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ mb: '2rem', textAlign: 'left' }}>Personal Information</Typography>

                <Typography
                  onClick={toggleIsEdit}
                  sx={{ color: '#2874f0', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Edit
                </Typography>
              </Box>

              <Grid
                container
                spacing={2}
                rowGap={2}
              >
                <Grid
                  item
                  xs={6}
                >
                  <TextField
                    sx={{ mb: 2 }}
                    label="First Name"
                    fullWidth
                    required
                    type="text"
                    disabled={!isEdit}
                    error={!!errors.firstName}
                    helperText={errors.firstName ? errors.firstName.message : ''}
                    {...register('firstName')}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                  <TextField
                    sx={{ mb: 2 }}
                    label="Last Name"
                    fullWidth
                    required
                    type="text"
                    disabled={!isEdit}
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ''}
                    {...register('lastName')}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                  <TextField
                    sx={{ mb: 2 }}
                    label="Email"
                    fullWidth
                    required
                    type="email"
                    disabled={!isEdit}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                    {...register('email')}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                >
                  <TextField
                    sx={{ mb: 2 }}
                    label="Phone Number"
                    fullWidth
                    required
                    disabled={!isEdit}
                    type="number"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                    {...register('phoneNumber')}
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
                disabled={!isEdit}
                sx={{ width: '100%', p: 1, mx: 'auto', mb: 0 }}
                type="submit"
              >
                {btnText}
              </PrimaryButton>
            </Box>
          </Box>
        </Grid>
        {googleAuth || (
          <Grid
            item
            xs={12}
            md={5}
          >
            <ChangePwdForm />
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default ProfileTab;
