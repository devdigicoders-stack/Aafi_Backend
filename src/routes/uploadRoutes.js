const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { protect, authorize } = require('../middlewares/authMiddleware');

// Configure Cloudinary using Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure uploads directory exists in the backend root
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif/i;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// @desc    Upload an image (Local + Cloudinary)
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }
  
  let cloudinaryUrl = null;
  
  try {
    // If Cloudinary keys are provided, upload it to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products'
      });
      cloudinaryUrl = result.secure_url;
      console.log('Image successfully uploaded to Cloudinary');
    }
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    // If cloudinary fails, it will safely fallback to local url below
  }

  // Return Cloudinary URL if successful, otherwise fallback to local URL
  const publicUrl = cloudinaryUrl || `/uploads/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    url: publicUrl,
    uploadedToCloudinary: !!cloudinaryUrl
  });
});

module.exports = router;
