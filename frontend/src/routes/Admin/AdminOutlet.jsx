import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminOutlet() {
  const data = useSelector((state) => state.auth.data);
  if (data.admin) {
    return <Outlet />;
  }
  return <Navigate to="/admin/login" />;
}

export default AdminOutlet;
