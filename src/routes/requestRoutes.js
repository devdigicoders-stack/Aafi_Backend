const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  getMyRequests, 
  getAllRequests, 
  getRequest, 
  updateRequest, 
  deleteRequest 
} = require('../controllers/requestController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// User Routes
router.route('/')
  .post(protect, createRequest) // User can create a request
  .get(protect, authorize('admin'), getAllRequests); // Admin can get all requests

router.get('/my-requests', protect, getMyRequests); // User can view their own requests

// Admin Routes (for single request operations)
router.route('/:id')
  .get(protect, authorize('admin'), getRequest) // Admin gets single request
  .put(protect, authorize('admin'), updateRequest) // Admin updates request
  .delete(protect, authorize('admin'), deleteRequest); // Admin deletes request

module.exports = router;
