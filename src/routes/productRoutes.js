const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductsByCategory, 
  getAdminProducts,
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes (Only returns 'approved' products)
router.get('/', getProducts);
router.get('/category/:categoryId', getProductsByCategory);

// Admin-specific route for ALL products
router.get('/admin/all', protect, authorize('admin'), getAdminProducts);

// Protected routes (Normal Users can POST, Admin can PUT/DELETE)
router.route('/')
  .post(protect, createProduct);

router.route('/:id')
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
