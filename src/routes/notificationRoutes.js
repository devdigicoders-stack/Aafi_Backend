const express = require('express');
const router = express.Router();
const { getNotifications, createNotification, deleteNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getNotifications)
  .post(protect, authorize('admin'), createNotification);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteNotification);

module.exports = router;
