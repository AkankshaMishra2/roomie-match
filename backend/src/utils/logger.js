 
// src/utils/logger.js
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create write streams for logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Custom log format
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

// Logger for HTTP requests
const requestLogger = morgan(logFormat, {
  stream: accessLogStream
});

// Custom logger implementation
const logger = {
  /**
   * Log information message
   * @param {string} message - Message to log
   * @param {Object} [metadata] - Additional metadata
   */
  info: (message, metadata = {}) => {
    const timestamp = new Date().toISOString();
    const logData = {
      level: 'info',
      timestamp,
      message,
      ...metadata
    };
    console.log(`[INFO] ${timestamp} - ${message}`);
    if (Object.keys(metadata).length > 0) {
      console.log(metadata);
    }
  },

  /**
   * Log warning message
   * @param {string} message - Message to log
   * @param {Object} [metadata] - Additional metadata
   */
  warn: (message, metadata = {}) => {
    const timestamp = new Date().toISOString();
    const logData = {
      level: 'warn',
      timestamp,
      message,
      ...metadata
    };
    console.warn(`[WARNING] ${timestamp} - ${message}`);
    if (Object.keys(metadata).length > 0) {
      console.warn(metadata);
    }
  },

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {Error|Object} [error] - Error object or metadata
   */
  error: (message, error = {}) => {
    const timestamp = new Date().toISOString();
    const logData = {
      level: 'error',
      timestamp,
      message,
      ...(error instanceof Error
        ? { error: { message: error.message, stack: error.stack } }
        : { metadata: error })
    };
    
    // Log to console
    console.error(`[ERROR] ${timestamp} - ${message}`);
    if (error instanceof Error) {
      console.error(error.stack);
    } else if (Object.keys(error).length > 0) {
      console.error(error);
    }
    
    // Log to file
    errorLogStream.write(`${JSON.stringify(logData)}\n`);
  },

  /**
   * Log debug message (only in development)
   * @param {string} message - Message to log
   * @param {Object} [metadata] - Additional metadata
   */
  debug: (message, metadata = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.debug(`[DEBUG] ${timestamp} - ${message}`);
      if (Object.keys(metadata).length > 0) {
        console.debug(metadata);
      }
    }
  },

  // Express middleware for HTTP request logging
  request: requestLogger
};

module.exports = logger;