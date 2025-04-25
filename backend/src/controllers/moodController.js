// src/controllers/moodController.js
const { db } = require('../config/firebase');

// Update user mood
exports.updateMood = async (req, res) => {
  try {
    const { userId } = req.params;
    const { mood, status, timestamp } = req.body;
    
    if (!userId || !mood) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and mood data are required' 
      });
    }

    const moodData = {
      userId,
      mood,
      status: status || '',
      timestamp: timestamp || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store mood in Firestore
    const moodRef = db.collection('moods').doc(userId);
    await moodRef.set(moodData, { merge: true });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Mood updated successfully',
      data: moodData
    });
  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mood',
      error: error.message
    });
  }
};

// Get user's current mood
exports.getUserMood = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const moodRef = db.collection('moods').doc(userId);
    const moodDoc = await moodRef.get();

    if (!moodDoc.exists) {
      return res.status(404).json({
        success: false,
        // src/controllers/moodController.js (continued)
        message: 'No mood found for this user'
      });
    }

    const moodData = moodDoc.data();

    res.status(200).json({
      success: true,
      data: moodData
    });
  } catch (error) {
    console.error('Error getting user mood:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user mood',
      error: error.message
    });
  }
};

// Get moods of all users
exports.getAllMoods = async (req, res) => {
  try {
    const moodsSnapshot = await db.collection('moods').get();
    
    const moods = [];
    for (const doc of moodsSnapshot.docs) {
      const moodData = doc.data();
      
      // Get user details
      const userDoc = await db.collection('users').doc(moodData.userId).get();
      const userData = userDoc.exists ? userDoc.data() : { displayName: 'Unknown User' };
      
      moods.push({
        ...moodData,
        displayName: userData.displayName,
        photoURL: userData.photoURL || null
      });
    }

    // Sort by most recent first
    moods.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      data: moods
    });
  } catch (error) {
    console.error('Error getting all moods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all moods',
      error: error.message
    });
  }
};