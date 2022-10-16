import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import UserNavbar from '../../components/user/NavBar/UserNavbar';
import UserFooter from '../../components/user/UserFooter';
import AllProductsPage from '../../pages/User/AllProductsPage';
import CartPage from '../../pages/User/CartPage';
import CheckoutPage from '../../pages/User/CheckoutPage';
import HomePage from '../../pages/User/HomePage';
import ProductPage from '../../pages/User/ProductPage';
import UserForgotPasswordPage from '../../pages/User/UserForgotPasswordPage';
import UserLoginPage from '../../pages/User/UserLoginPage';
import UserOtpLoginPage from '../../pages/User/UserOtpLoginPage';
import UserProfilePage from '../../pages/User/UserProfilePage';
import UserRegisterPage from '../../pages/User/UserRegisterPage';
import WishlistPage from '../../pages/User/WishlistPage';
import UserOutlet from './UserOutlet';

function UserRoutes() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      <UserNavbar />

      <Box
        sx={{
          paddingTop: '55px',
          flexGrow: 1,
          backgroundColor: '#fff'
        }}
      >
        <Routes>
          <Route path="/">
            {/* All Public routes */}
            <Route
              index
              element={<HomePage />}
            />
            <Route
              path="login"
              element={<UserLoginPage />}
            />
            <Route
              path="otplogin"
              element={<UserOtpLoginPage />}
            />
            <Route
              path="register"
              element={<UserRegisterPage />}
            />
            <Route
              path="forgotpassword"
              element={<UserForgotPasswordPage />}
            />
            <Route
              path="products"
              element={<AllProductsPage />}
            />
            <Route
              path="product/:id"
              element={<ProductPage />}
            />

            {/* All Private routes */}

            <Route
              path="*"
              element={<UserOutlet />}
            >
              <Route
                path="profile"
                element={<UserProfilePage />}
              />

              <Route
                path="checkout"
                element={<CheckoutPage />}
              />
              <Route
                path="cart"
                element={<CartPage />}
              />
              <Route
                path="wishlist"
                element={<WishlistPage />}
              />
            </Route>
          </Route>
        </Routes>
      </Box>
      <UserFooter />
    </Box>
  );
}

export default UserRoutes;
