// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: 2,
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
      ]
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
exports.getUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: { id: req.params.id, name: 'Sample User', email: 'user@example.com' }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400);
      throw new Error('Please add name and email');
    }

    res.status(201).json({
      success: true,
      data: { name, email }
    });
  } catch (err) {
    next(err);
  }
};
