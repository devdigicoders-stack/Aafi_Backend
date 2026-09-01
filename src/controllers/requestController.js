const Request = require('../models/requestModel');

// @desc    Create a new request (User)
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Please provide a title and description');
    }

    const request = await Request.create({
      user: req.user._id,
      title,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user's requests
// @route   GET /api/requests/my-requests
// @access  Private
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ user: req.user._id }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all requests (Admin)
// @route   GET /api/requests
// @access  Private/Admin
exports.getAllRequests = async (req, res, next) => {
  try {
    // Populate user to get name and email of the requester
    const requests = await Request.find().populate('user', 'name email mobile').sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single request (Admin)
// @route   GET /api/requests/:id
// @access  Private/Admin
exports.getRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate('user', 'name email mobile');
    
    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update request status or response (Admin)
// @route   PUT /api/requests/:id
// @access  Private/Admin
exports.updateRequest = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;

    let request = await Request.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    if (status !== undefined) {
      if (!['pending', 'in-progress', 'completed', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status value');
      }
      request.status = status;
    }
    
    if (adminResponse !== undefined) {
      request.adminResponse = adminResponse;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: request
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a request (Admin)
// @route   DELETE /api/requests/:id
// @access  Private/Admin
exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
