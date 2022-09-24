import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../redux/reducers/authSlice';
import { setToast } from '../redux/reducers/toastSlice';

function useApiErrorHandler() {
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      console.error(error);
      dispatch(setToast({ open: true, data: error.data || error.message }));
      if (error.data.statusCode === 403) {
        dispatch(deleteToken());
        navigate('/admin/login');
      }
      if (error.data.name === 'TokenExpiredError' || error.data.status === 'fail') {
        dispatch(deleteToken());
        navigate('/admin/login');
      }
      setError(null);
    }
  }, [error]);
  return setError;
}

export default useApiErrorHandler;
