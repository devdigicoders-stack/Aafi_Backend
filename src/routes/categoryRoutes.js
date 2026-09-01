const express = require('express');
const router = express.Router();
const { getCategories, getAdminCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

router.get('/admin', protect, authorize('admin'), getAdminCategories);

router.route('/:id')
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
