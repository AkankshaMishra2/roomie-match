 
// src/routes/moodRoutes.js
const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const authMiddleware = require('../middleware/auth');

// Update user mood
router.post('/:userId', authMiddleware, moodController.updateMood);

// Get user's current mood
router.get('/:userId', authMiddleware, moodController.getUserMood);

// Get all users' moods
router.get('/', authMiddleware, moodController.getAllMoods);

module.exports = router;