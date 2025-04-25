 
// src/config/cors.js
const cors = require('cors');
require('dotenv').config();

/**
 * Configure CORS options for the application
 * @returns {Object} Configured CORS middleware
 */
const configureCors = () => {
  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  };

  return cors(corsOptions);
};

module.exports = configureCors;