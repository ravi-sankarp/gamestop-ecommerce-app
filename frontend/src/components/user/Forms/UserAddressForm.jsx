/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import * as yup from 'yup';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { setToast } from '../../../redux/reducers/toastSlice';
import { useAddAddressMutation } from '../../../redux/api/userApiSlice';

function UserAddressForm({ open, toggleForm }) {
  const [formError, setFormError] = useState('');
  const [btnText, setBtnText] = useState('Add Address');
  const dispatch = useDispatch();
  const [addAddress, { isLoading }] = useAddAddressMutation();

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Please enter you name')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as last name ')
      .min(4, 'Name must be atleast 4 characters'),
    phoneNumber: yup
      .string()
      .matches(/^[6-9]\d{9}$/, 'Enter a valid phone number')
      .required('Please enter your phone number'),
    houseName: yup
      .string()
      .required('Please enter your house name')
      .min(4, 'House name must be atleast 4 characters'),
    streetName: yup
      .string()
      .required('Please enter the street name')
      .min(4, 'Street name must be atleast 4 characters'),
    city: yup
      .string()
      .required('Please enter the city name')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as city name ')
      .min(4, 'City name must be atleast 4 characters'),
    district: yup
      .string()
      .required('Please enter the district name')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as district name ')
      .min(4, 'District name must be atleast 4 characters'),
    state: yup
      .string()
      .required('Please enter the state name')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as state name ')
      .min(4, 'State name must be atleast 4 characters'),
    pincode: yup
      .string()
      .required('Please enter the pincode')
      .min(6, 'Pincode name must be 6 characters')
      .max(6, 'Pincode name must be 6 characters')
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
        const res = await addAddress(data).unwrap();
        dispatch(setToast({ data: res, open: true }));
        setFormError('');
        toggleForm();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } catch (err) {
        setBtnText('Add Address');
        setFormError(err.data.message);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={toggleForm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex' }}>
          <Typography
            variant="h6"
            align="center"
            component="div"
            style={{ flexGrow: 1 }}
          >
            Enter your details
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            onClick={toggleForm}
            sx={{ fontSize: { xs: 10 }, p: 0, m: 0, border: 0, justifySelf: 'flex-end' }}
          >
            <CloseOutlinedIcon />
          </Button>
        </Box>
      </DialogTitle>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: { md: '50vw' },
            textAlign: 'center',
            backgroundColor: '#ffffff',
            minHeight: '60vh',
            maxHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '20px 20px', md: '40px 80px' }
          }}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
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
              xs={6}
            >
              <TextField
                sx={{ mb: 2 }}
                label="Name"
                fullWidth
                required
                type="text"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ''}
                {...register('name')}
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
                type="number"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                {...register('phoneNumber')}
              />
            </Grid>
            <Grid
              item
              xs={6}
            >
              <TextField
                sx={{ mb: 2 }}
                label="House Name"
                fullWidth
                required
                type="text"
                error={!!errors.houseName}
                helperText={errors.houseName ? errors.houseName.message : ''}
                {...register('houseName')}
              />
            </Grid>

            <Grid
              item
              xs={6}
            >
              <TextField
                sx={{ mb: 2 }}
                label="Street Name"
                fullWidth
                required
                type="text"
                error={!!errors.streetName}
                helperText={errors.streetName ? errors.streetName.message : ''}
                {...register('streetName')}
              />
            </Grid>

            <Grid
              item
              xs={6}
            >
              <TextField
                sx={{ mb: 2 }}
                label="City"
                fullWidth
                required
                type="text"
                error={!!errors.city}
                helperText={errors.city ? errors.city.message : ''}
                {...register('city')}
              />
            </Grid>

            <Grid
              item
              xs={6}
            >
              <TextField
                sx={{ mb: 2 }}
                label="District"
                fullWidth
                required
                type="text"
                error={!!errors.district}
                helperText={errors.district ? errors.district.message : ''}
                {...register('district')}
              />
            </Grid>

            <Grid
              item
              xs={6}
            >
              <TextField
                sx={{ mb: 2 }}
                label="State"
                fullWidth
                required
                type="text"
                error={!!errors.state}
                helperText={errors.state ? errors.state.message : ''}
                {...register('state')}
              />
            </Grid>

            <Grid
              item
              xs={6}
            >
              <TextField
                sx={{ mb: 2 }}
                label="Pincode"
                fullWidth
                required
                type="number"
                error={!!errors.pincode}
                helperText={errors.pincode ? errors.pincode.message : ''}
                {...register('pincode')}
              />
            </Grid>
          </Grid>
          <PrimaryButton
            sx={{ padding: '8px 20px', mx: 'auto' }}
            type="submit"
          >
            {btnText}
          </PrimaryButton>
        </Box>
      </Box>
    </Dialog>
  );
}

export default UserAddressForm;
