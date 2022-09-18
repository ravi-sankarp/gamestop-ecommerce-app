import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import UserRegisterForm from '../../components/user/Forms/UserRegisterForm';

function UserRegisterPage() {
  const stateData = useSelector((state) => state.auth.data);
  if (stateData.token) {
    return <Navigate to="/" />;
  }

  return <UserRegisterForm />;
}

export default UserRegisterPage;
