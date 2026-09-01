const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, getUser, updateUser, blockUser, getDashboardStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes here require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);

router.get('/users', getAllUsers);
router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/users/:id/role', updateUserRole);
router.patch('/users/:id/block', blockUser);

module.exports = router;
