/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import Login from '../../components/admin/Login/Login';
import { useAdminLoginMutation } from '../../redux/api/authApiSlice';
import { setToken } from '../../redux/reducers/authSlice';
import { setToast } from '../../redux/reducers/toastSlice';

function AdminLoginPage() {
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const stateData = useSelector((state) => state.auth.data);
  if (stateData.admin) {
    return <Navigate to="/admin/dashboard" />;
  }
  const handleAdminLogin = async (data) => {
    if (!isLoading) {
      try {
        const res = await adminLogin(data).unwrap();
        if (res.status === 'success') {
          dispatch(setToast({ data: res, open: true }));
          setFormError('');
          await dispatch(setToken(res));
          navigate('/admin/dashboard');
        }
      } catch (err) {
        setFormError(err.data.message);
      }
    }
  };
  return <Login formError={formError} handleAdminLogin={handleAdminLogin} />;
}

export default AdminLoginPage;
