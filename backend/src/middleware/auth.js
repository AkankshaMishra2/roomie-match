 
// src/middleware/auth.js
const { admin } = require('../config/firebase');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      
      // Check if the requested userId matches the token userId
      const requestedUserId = req.params.userId;
      if (requestedUserId && requestedUserId !== decodedToken.uid) {
        // Allow admin users to access any user's data
        if (!decodedToken.admin) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: You do not have permission to access this resource'
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid token',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};