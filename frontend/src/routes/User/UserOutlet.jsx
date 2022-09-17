import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserOutlet() {
  const data = useSelector((state) => state.auth.data);
  if (data.token) {
    return <Outlet />;
  }
  return <Navigate to="/home" />;
}

export default UserOutlet;
