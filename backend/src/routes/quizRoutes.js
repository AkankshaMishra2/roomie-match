 

// src/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');

// Get quiz questions
router.get('/questions', quizController.getQuizQuestions);

// Submit quiz results
router.post('/:userId', authMiddleware, quizController.submitQuizResults);

// Get compatibility scores
router.get('/compatibility/:userId', authMiddleware, quizController.getCompatibilityScores);

module.exports = router;