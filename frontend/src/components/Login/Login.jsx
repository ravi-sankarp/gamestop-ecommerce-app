/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { Alert, Box, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { PrimaryButton } from '../../MaterialUiConfig/styled';

function Login({ handleAdminLogin, formError }) {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(3)
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const onSubmitHandler = (data) => {
    handleAdminLogin(data);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '100vw',
        height: '100vh',
        backgroundColor: '#1098ad',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        flexGrow: 2
      }}
    >
      <Box
        sx={{
          width: { xs: '50vw', md: 'max-content' },
          maxWidth: { md: '30vw' },
          p: 5,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          minHeight: '50vh'
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
        <PrimaryButton sx={{ width: '200px', p: 1 }} type="submit">
          Login
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default Login;
