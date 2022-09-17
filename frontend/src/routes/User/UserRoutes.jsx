import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
// import UserNavbar from '../../components/user/UserNavbar';
import AllProductsPage from '../../pages/User/AllProductsPage';
import HomePage from '../../pages/User/HomePage';
import ProductPage from '../../pages/User/ProductPage';
import UserLoginPage from '../../pages/User/UserLoginPage';
import UserRegisterPage from '../../pages/User/UserRegisterPage';

function UserRoutes() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        backgroundColor: '#dddddd5e',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      {/* <UserNavbar /> */}

      <Box
        sx={{
          paddingTop: '10vh',
          paddingRight: '1rem',
          flexGrow: 1
        }}
      >
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
            <Route path="login" element={<UserLoginPage />} />
            <Route path="register" element={<UserRegisterPage />} />
            <Route path="allproducts" element={<AllProductsPage />} />
            <Route path="product/:id" element={<ProductPage />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}

export default UserRoutes;
