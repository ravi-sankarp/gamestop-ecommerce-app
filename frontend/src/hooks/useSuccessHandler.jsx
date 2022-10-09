import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToast } from '../redux/reducers/toastSlice';

function useSuccessHandler() {
  const [data, setData] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data?.status) {
      dispatch(setToast({ data, open: true }));
      setData(null);
    }
  }, [data, dispatch]);
  return setData;
}

export default useSuccessHandler;
