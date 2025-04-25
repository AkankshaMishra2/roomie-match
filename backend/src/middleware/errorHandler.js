 
// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    // Log the error for server-side debugging
    console.error('ERROR:', err);
  
    // Default error status and message
    const status = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
  
    // Specific error handling for various types of errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: err.errors
      });
    }
  
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }
  
    if (err.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  
    // General error response
    res.status(status).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };