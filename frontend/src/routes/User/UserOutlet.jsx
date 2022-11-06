import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../../redux/reducers/toastSlice';

function UserOutlet() {
  const { token } = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();

  if (!token) {
    const toast = {
      message: 'Please Login to continue'
    };
    dispatch(setToast({ data: toast, open: true }));
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default UserOutlet;
