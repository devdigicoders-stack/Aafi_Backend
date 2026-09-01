const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getUsers)
  .post(protect, createUser); // Protect POST request as an example

router.route('/:id')
  .get(getUser);

module.exports = router;
