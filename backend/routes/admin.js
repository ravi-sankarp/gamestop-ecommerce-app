import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import { protect, checkAdmin } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';

const router = Router();

//GET List All Users Route
router.get('/getusers', protect, checkAdmin, adminController.listUsers);

//PUT Edit User Route
router.put('/edituser/:id', protect, checkAdmin, adminController.editUser);

//PUT Block User Route
router.put('/changeuserstatus', protect, checkAdmin, adminController.changeUserStatus);

//GET List All Categories Route
router.get('/getcategories', protect, checkAdmin, adminController.listCategories);

//POST Add Category Route
router.post(
  '/addcategory',
  protect,
  checkAdmin,
  upload.single('bannerImg'),
  adminController.addCategory
);

//PUT Edit Category Route
router.put(
  '/editcategory/:id',
  protect,
  checkAdmin,
  upload.single('bannerImg'),
  adminController.editCategory
);

//DELETE Delete Category Route
router.delete('/deletecategory/:id', protect, checkAdmin, adminController.deleteCategory);

//GET List All Products Route
router.get('/getproducts', protect, checkAdmin, adminController.listProducts);

//POST Add Product Route
router.post(
  '/addproduct',
  protect,
  checkAdmin,
  upload.array('images', 4),
  adminController.addProduct
);

//PUT Edit Product Route
router.put(
  '/editproduct/:id',
  protect,
  checkAdmin,
  upload.array('images', 4),
  adminController.editProduct
);

//DELETE Delete Product Route
router.delete('/deleteproduct/:id', protect, checkAdmin, adminController.deleteProduct);

//GET List All Brands Route
router.get('/getbrands', protect, checkAdmin, adminController.listBrands);

//POST Add Brand Route
router.post('/addbrand', protect, checkAdmin, upload.single('bannerImg'), adminController.addBrand);

//PUT Edit Brand Route
router.put(
  '/editbrand/:id',
  protect,
  checkAdmin,
  upload.single('bannerImg'),
  adminController.editBrand
);

//DELeTE Delete Brand Route
router.delete('/deletebrand/:id', protect, checkAdmin, adminController.deleteBrand);

//GET List All Banners Route
router.get('/getbanners', protect, checkAdmin, adminController.listBanners);

//POST Add Banners Route
router.post(
  '/addbanner',
  protect,
  checkAdmin,
  upload.single('bannerImg'),
  adminController.addBanner
);

//PUT Edit Banner Route
router.put(
  '/editbanner/:id',
  protect,
  checkAdmin,
  upload.single('bannerImg'),
  adminController.editBanner
);

//DELETE Delete Banner Route
router.delete('/deletebanner/:id', protect, checkAdmin, adminController.deleteBanner);

//GET All order details
router.get('/getallorders', protect, checkAdmin, adminController.listAllOrders);

//GET All payment details
router.get('/getallpayments', protect, checkAdmin, adminController.listAllOrders);

//PUT Update order status
router.patch('/changeorderstatus', protect, checkAdmin, adminController.updateOrderStatus);

// Get Dashboard Card Data
router.get('/getdashboardcarddata', protect, checkAdmin, adminController.getDashboardCardData);

// Get Dashboard Card Data
router.get('/getdashboardgraphdata', protect, checkAdmin, adminController.getDashboardGraphData);

// View Category and Product Offers
router.get('/getalloffers', protect, checkAdmin, adminController.getAllOffers);

// Add New Category or Product Offer
router.post('/addnewoffer', protect, checkAdmin, adminController.addNewOffer);

// Edit an existing offer
router.put('/editoffer/:id', protect, checkAdmin, adminController.editOffer);

// Delete an existing offer
router.delete('/deleteoffer/:id', protect, checkAdmin, adminController.deleteOffer);

// Get All coupons
router.get('/getallcoupons', protect, checkAdmin, adminController.getAllCoupons);

// Add New Coupon
router.post('/addnewcoupon', protect, checkAdmin, adminController.addNewCoupon);

// Edit an existing coupon
router.put('/editcoupon/:id', protect, checkAdmin, adminController.editCoupon);

// Delete an existing coupon
router.delete('/deletecoupon/:id', protect, checkAdmin, adminController.deleteCoupon);

export default router;
