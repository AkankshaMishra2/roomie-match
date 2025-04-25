 
// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Get authenticated user data
router.get('/user/:userId', authMiddleware, authController.getAuthUser);

// Update user profile
router.put('/user/:userId', authMiddleware, authController.updateUserProfile);

// Get all users (for directory/discovery)
router.get('/users', authMiddleware, authController.getAllUsers);

module.exports = router;