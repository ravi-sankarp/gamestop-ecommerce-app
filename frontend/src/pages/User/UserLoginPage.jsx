/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import UserLoginForm from '../../components/user/Forms/UserLoginForm';
import UserOtpLoginForm from '../../components/user/Forms/UserOtpLoginForm';

function UserLoginPage() {
  const [loginMethod, setLoginMethod] = useState('normal');
  const stateData = useSelector((state) => state.auth.data);
  if (stateData.token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {loginMethod === 'normal' && <UserLoginForm setLoginMethod={setLoginMethod} />}
      {loginMethod === 'otp' && <UserOtpLoginForm />}
    </>
  );
}

export default UserLoginPage;
