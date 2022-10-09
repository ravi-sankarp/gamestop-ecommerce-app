import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../../redux/reducers/toastSlice';

function UserOutlet() {
  const data = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!data.token) {
    const toast = {
      message: 'Please Login to continue'
    };
    navigate('/login');
    dispatch(setToast({ data: toast, open: true }));
  }

  return <Outlet />;
}

export default UserOutlet;
