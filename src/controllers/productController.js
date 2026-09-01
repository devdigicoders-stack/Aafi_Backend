const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// @desc    Get logged in user's products
// @route   GET /api/products/my-products
// @access  Private
exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user._id })
      .populate('category', 'name')
      .sort('-createdAt');
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all active AND approved products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, status: 'approved' })
      .populate('category', 'name')
      .populate('user', 'name')
      .sort('-createdAt');
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get active AND approved products by category ID
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    const products = await Product.find({ 
      category: req.params.categoryId,
      isActive: true,
      status: 'approved'
    }).populate('category', 'name').populate('user', 'name').sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get ALL products for admin (Pending, Approved, Rejected)
// @route   GET /api/products/admin/all
// @access  Private/Admin
exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('user', 'name email mobile')
      .sort('-createdAt');
      
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, imageUrl, description, callNumber, whatsappNumber, isActive, status } = req.body;

    if (!name || !category || !imageUrl || !description) {
      res.status(400);
      throw new Error('Please provide name, category, imageUrl and description');
    }
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(404);
        throw new Error('Selected category does not exist');
    }

    const productData = {
      name,
      category,
      imageUrl,
      description,
      callNumber,
      whatsappNumber,
      user: req.user._id,
      isActive: isActive !== undefined ? isActive : true
    };
    
    // Allow admin to set status on creation (e.g. directly to 'approved')
    if (req.user.role === 'admin' && status) {
      productData.status = status;
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' ? 'Product created successfully' : 'Product submitted successfully and is pending approval',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, category, imageUrl, description, callNumber, whatsappNumber, isActive, status } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
          res.status(404);
          throw new Error('Selected category does not exist');
      }
      product.category = category;
    }

    if (name !== undefined) product.name = name;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (description !== undefined) product.description = description;
    if (callNumber !== undefined) product.callNumber = callNumber;
    if (whatsappNumber !== undefined) product.whatsappNumber = whatsappNumber;
    if (isActive !== undefined) product.isActive = isActive;
    
    if (status !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status value');
      }
      product.status = status;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
