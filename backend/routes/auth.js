const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
  login,
  register,
  getProfile,
  verifyToken: verifyTokenController
} = require('../controllers/authController');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.get('/verify', verifyToken, verifyTokenController);

// Admin only routes
router.post('/register', verifyToken, requireAdmin, register);

module.exports = router;