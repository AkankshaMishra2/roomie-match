// src/controllers/authController.js
const { admin, db } = require('../config/firebase');

// Verify user token and get user data
exports.getAuthUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Get user from Firebase Auth
    const userRecord = await admin.auth().getUser(userId);
    
    // Get additional user data from Firestore
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    
    const userData = userDoc.exists 
      ? { ...userRecord.toJSON(), ...userDoc.data() }
      : userRecord.toJSON();

    // Remove sensitive information
    delete userData.passwordHash;
    delete userData.passwordSalt;
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const allowedUpdates = ['displayName', 'photoURL', 'phoneNumber', 'bio', 'preferences'];
    const filteredUpdates = {};
    
    // Filter out any fields that aren't allowed
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });
    
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Update Auth profile if needed
    const authUpdates = {};
    if (filteredUpdates.displayName) authUpdates.displayName = filteredUpdates.displayName;
    if (filteredUpdates.photoURL) authUpdates.photoURL = filteredUpdates.photoURL;
    if (filteredUpdates.phoneNumber) authUpdates.phoneNumber = filteredUpdates.phoneNumber;
    
    if (Object.keys(authUpdates).length > 0) {
      await admin.auth().updateUser(userId, authUpdates);
    }

    // Update Firestore profile
    const userDocRef = db.collection('users').doc(userId);
    await userDocRef.set({
      ...filteredUpdates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Get updated user data
    const userDoc = await userDocRef.get();
    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
};

// Get all users (for directory/discovery)
exports.getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    
    const users = [];
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      
      // Only include necessary info for directory listing
      users.push({
        uid: userData.uid,
        displayName: userData.displayName || 'Anonymous',
        photoURL: userData.photoURL || null,
        bio: userData.bio || '',
        createdAt: userData.createdAt
      });
    }

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all users',
      error: error.message
    });
  }
};