import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import HelmetMeta from '../../components/HelmetMeta';
import UserRegisterForm from '../../components/user/Forms/UserRegisterForm';

function UserRegisterPage() {
  const stateData = useSelector((state) => state.auth.data);
  if (stateData.token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <HelmetMeta title="Register New Account | Gamestop" />

      <UserRegisterForm />
    </>
  );
}

export default UserRegisterPage;
