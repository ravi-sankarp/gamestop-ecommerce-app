import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteToken } from '../redux/reducers/authSlice';
import { setToast } from '../redux/reducers/toastSlice';

function useApiErrorHandler() {
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (error) {
      console.error(error);
      dispatch(setToast({ open: true, data: error.data || error }));
      if (error?.data?.statusCode === 403) {
        dispatch(deleteToken());
        if (pathname.split('/').includes('admin')) {
          navigate('/admin/login');
        } else {
          navigate('/login');
        }
      }
      if (error?.data?.name === 'TokenExpiredError') {
        dispatch(deleteToken());
        if (pathname.split('/').includes('admin')) {
          navigate('/admin/login');
        } else {
          navigate('/login');
        }
      }
      if (error?.data?.message === 'User recently changed password! Login again') {
        dispatch(deleteToken());
        if (pathname.split('/').includes('admin')) {
          navigate('/admin/login');
        } else {
          navigate('/login');
        }
      }
      setError(null);
    }
  }, [error, dispatch, navigate, pathname]);
  return setError;
}

export default useApiErrorHandler;
