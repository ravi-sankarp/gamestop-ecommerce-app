import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import UserLoginForm from '../../components/user/Forms/UserLoginForm';
import HelmetMeta from '../../components/HelmetMeta';

function UserLoginPage() {
  const stateData = useSelector((state) => state.auth.data);
  if (stateData.token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <HelmetMeta title="Login | Gamestop" />

      <UserLoginForm />
    </>
  );
}

export default UserLoginPage;
