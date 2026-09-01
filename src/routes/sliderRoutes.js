const express = require('express');
const router = express.Router();
const { getSliders, getAdminSliders, createSlider, updateSlider, deleteSlider } = require('../controllers/sliderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getSliders)
  .post(protect, authorize('admin'), createSlider);

router.get('/admin', protect, authorize('admin'), getAdminSliders);

router.route('/:id')
  .put(protect, authorize('admin'), updateSlider)
  .delete(protect, authorize('admin'), deleteSlider);

module.exports = router;
