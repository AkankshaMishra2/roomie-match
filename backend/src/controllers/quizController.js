// src/controllers/quizController.js
const { db } = require('../config/firebase');
const { calculateCompatibility } = require('../utils/compatibility');

// Submit quiz results
exports.submitQuizResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const { answers } = req.body;
    
    if (!userId || !answers) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and quiz answers are required' 
      });
    }

    // Validate that we have answers
    if (Object.keys(answers).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz answers cannot be empty' 
      });
    }

    // Get current timestamp
    const timestamp = new Date().toISOString();

    // Store quiz results in Firestore
    const quizRef = db.collection('quizResults').doc(userId);
    await quizRef.set({
      userId,
      answers,
      timestamp,
      updatedAt: timestamp
    }, { merge: true });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Quiz results submitted successfully',
      data: {
        userId,
        timestamp
      }
    });
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz results',
      error: error.message
    });
  }
};

// Get compatibility scores with other users
exports.getCompatibilityScores = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Get current user quiz results
    const userQuizRef = db.collection('quizResults').doc(userId);
    const userQuizDoc = await userQuizRef.get();

    if (!userQuizDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'No quiz results found for this user'
      });
    }

    const userAnswers = userQuizDoc.data().answers;

    // Get all other users' quiz results
    const allQuizResults = await db.collection('quizResults').get();
    
    const compatibilityScores = [];

    // Calculate compatibility with each user
    for (const doc of allQuizResults.docs) {
      const otherUserId = doc.id;
      
      // Skip comparing with self
      if (otherUserId === userId) continue;
      
      const otherUserAnswers = doc.data().answers;
      
      // Calculate compatibility score
      const score = calculateCompatibility(userAnswers, otherUserAnswers);
      
      // Get user details
      const userDoc = await db.collection('users').doc(otherUserId).get();
      const userData = userDoc.exists ? userDoc.data() : { displayName: 'Unknown User' };
      
      compatibilityScores.push({
        userId: otherUserId,
        displayName: userData.displayName,
        photoURL: userData.photoURL || null,
        score,
        categories: score.categories
      });
    }

    // Sort by overall compatibility score (descending)
    compatibilityScores.sort((a, b) => b.score.overall - a.score.overall);

    res.status(200).json({
      success: true,
      data: compatibilityScores
    });
  } catch (error) {
    console.error('Error getting compatibility scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get compatibility scores',
      error: error.message
    });
  }
};

// Get quiz questions
exports.getQuizQuestions = async (req, res) => {
  try {
    // In a real application, you might fetch these from Firestore
    // For now, we'll return hardcoded questions
    const questions = [
      {
        id: 1,
        question: "Night owl or early bird?",
        options: ["Night owl", "Early bird"]
      },
      {
        id: 2,
        question: "Clean as you go or deep clean once a week?",
        options: ["Clean as you go", "Deep clean once a week"]
      },
      // ... add all other questions
    ];

    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error getting quiz questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quiz questions',
      error: error.message
    });
  }
};