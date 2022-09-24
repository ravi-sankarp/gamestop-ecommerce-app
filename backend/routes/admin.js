import { Router } from 'express';
import adminController from '../contollers/adminController.js';
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

//DELeTE Delete Banner Route
router.delete('/deletebanner/:id', protect, checkAdmin, adminController.deleteBanner);

export default router;
