/* eslint-disable consistent-return */
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginWithGoogleMutation } from '../../../redux/api/authApiSlice';
import { setToken } from '../../../redux/reducers/authSlice';
import { setToast } from '../../../redux/reducers/toastSlice';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function GoogleLoginComponent({ text, width, setError }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginWithGoogle, { isLoading }] = useLoginWithGoogleMutation();

  const handleGoogleResponse = async (response) => {
    if (!isLoading) {
      try {
        const res = await loginWithGoogle({ token: response.credential }).unwrap();
        if (res.status === 'success') {
          await dispatch(setToken(res));
          dispatch(setToast({ data: res, open: true }));
          setError('');
          navigate(res.redirectUrl ?? '/');
        }
      } catch (err) {
        setError(err.data.message);
      }
    }
  };

  useEffect(() => {
    const renderGoogleButton = async () => {
      if (!window?.google) {
        await loadScript('https://accounts.google.com/gsi/client');
      }

      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      });

      window.google.accounts.id.renderButton(document.getElementById('googleSignIn'), {
        theme: 'outlined',
        size: 'large',
        text,
        width
      });
    };
    renderGoogleButton();
  }, []);
  return (
    <>
      <Box
        id="googleSignIn"
        sx={{ display: 'flex', justifyContent: 'center' }}
      />
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            width: '100%',
            height: '100vh',
            overflowY: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
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
      )}
    </>
  );
}

export default GoogleLoginComponent;
