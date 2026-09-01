const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category for this product']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for the product']
  },
  description: {
    type: String,
    required: [true, 'Please add a description for the product']
  },
  callNumber: {
    type: String,
    required: [false, 'Please add a call number']
  },
  whatsappNumber: {
    type: String,
    required: [false, 'Please add a whatsapp number']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
