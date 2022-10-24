import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import apiSlice from '../redux/api/apiSlice';
import { deleteAdminToken } from '../redux/reducers/adminAuthSlice';
import { deleteToken } from '../redux/reducers/authSlice';
import { setToast } from '../redux/reducers/toastSlice';

function useApiErrorHandler() {
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleTokenDelete = async () => {
    if (pathname.split('/').includes('admin')) {
      await dispatch(deleteAdminToken());
      navigate('/admin/login');
    } else {
      await dispatch(deleteToken());
      navigate('/login');
    }
    await dispatch(apiSlice.util.resetApiState());
  };
  useEffect(() => {
    if (error) {
      dispatch(setToast({ open: true, data: error.data || error }));
      if (error?.data?.statusCode === 403) {
        handleTokenDelete();
      }
      if (error?.data?.name === 'TokenExpiredError') {
        handleTokenDelete();
      }
      if (error?.data?.message === 'User recently changed password! Login again') {
        handleTokenDelete();
        dispatch(apiSlice.util.resetApiState());
      }
      if (error?.data?.message === 'Your session has expired! Please log in again.') {
        handleTokenDelete();
      }
      if (error?.data?.message === 'The user no longer exists') {
        handleTokenDelete();
      }
      if (error?.data?.message === 'Invalid token. Please log in again!') {
        handleTokenDelete();
      }
      setError(null);
    }
  }, [error, dispatch, navigate, pathname, handleTokenDelete]);
  return setError;
}

export default useApiErrorHandler;
