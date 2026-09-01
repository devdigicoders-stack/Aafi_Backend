const Slider = require('../models/sliderModel');

// @desc    Get all active sliders
// @route   GET /api/sliders
// @access  Public
exports.getSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: sliders.length,
      data: sliders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all sliders (Admin only, includes inactive)
// @route   GET /api/sliders/admin
// @access  Private/Admin
exports.getAdminSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find({}).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: sliders.length,
      data: sliders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new slider (Admin only)
// @route   POST /api/sliders
// @access  Private/Admin
exports.createSlider = async (req, res, next) => {
  try {
    const { title, imageUrl, link, isActive } = req.body;

    if (!imageUrl) {
      res.status(400);
      throw new Error('Please provide an image URL for the slider');
    }

    const slider = await Slider.create({
      title,
      imageUrl,
      link,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Slider created successfully',
      data: slider
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update slider details (Admin only)
// @route   PUT /api/sliders/:id
// @access  Private/Admin
exports.updateSlider = async (req, res, next) => {
  try {
    const { title, imageUrl, link, isActive } = req.body;

    let slider = await Slider.findById(req.params.id);

    if (!slider) {
      res.status(404);
      throw new Error('Slider not found');
    }

    if (title !== undefined) slider.title = title;
    if (imageUrl !== undefined) slider.imageUrl = imageUrl;
    if (link !== undefined) slider.link = link;
    if (isActive !== undefined) slider.isActive = isActive;

    await slider.save();

    res.status(200).json({
      success: true,
      message: 'Slider updated successfully',
      data: slider
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a slider (Admin only)
// @route   DELETE /api/sliders/:id
// @access  Private/Admin
exports.deleteSlider = async (req, res, next) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      res.status(404);
      throw new Error('Slider not found');
    }

    await Slider.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Slider deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
