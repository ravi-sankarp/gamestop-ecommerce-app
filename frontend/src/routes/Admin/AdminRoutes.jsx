import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import AdminOutlet from './AdminOutlet';
import AdminBrandsPage from '../../pages/Admin/AdminBrandsPage';
import AdminCategoryPage from '../../pages/Admin/AdminCategoryPage';
import AdminDashboardPage from '../../pages/Admin/AdminDashboardPage';
import AdminLoginPage from '../../pages/Admin/AdminLoginPage';
import AdminProductsPage from '../../pages/Admin/AdminProductsPage';
import AdminBannersPage from '../../pages/Admin/AdminBannerPage';
import AdminUsersPage from '../../pages/Admin/AdminUsersPage';
import AdminOrdersPage from '../../pages/Admin/AdminOrdersPage';
import AdminPaymentsPage from '../../pages/Admin/AdminPaymentsPage';
import Sidebar from '../../components/admin/Sidebar/Sidebar';
import AdminAddNewProductPage from '../../pages/Admin/AdminAddNewProductPage';
import AdminEditProductPage from '../../pages/Admin/AdminEditProductPage';
import AdminCouponsPage from '../../pages/Admin/AdminCouponsPage';
import AdminOffersPage from '../../pages/Admin/AdminOffersPage';
import AdminSalesReportPage from '../../pages/Admin/AdminSalesReportPage';

function AdminRoutes() {
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
      <Sidebar />
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
      </Routes>
      <Box
        sx={{
          paddingTop: '10vh',
          paddingRight: '1rem',
          flexGrow: 1
        }}
      >
        <Routes>
          <Route path="/" element={<AdminOutlet />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="addnewproduct" element={<AdminAddNewProductPage />} />
            <Route path="editproduct/:id" element={<AdminEditProductPage />} />
            <Route path="categories" element={<AdminCategoryPage />} />
            <Route path="brands" element={<AdminBrandsPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="salesreport" element={<AdminSalesReportPage />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}

export default AdminRoutes;
