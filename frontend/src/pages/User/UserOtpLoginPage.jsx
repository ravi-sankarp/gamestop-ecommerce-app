import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import UserOtpLoginForm from '../../components/user/Forms/UserOtpLoginForm';

function UserOtpLoginPage() {
    const stateData = useSelector((state) => state.auth.data);
    if (stateData.token) {
      return <Navigate to="/" />;
    }

  return <UserOtpLoginForm />;
}

export default UserOtpLoginPage;
