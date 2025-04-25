 
// src/models/User.js
/**
 * User model - defines the structure and validation for user data
 */
class User {
    /**
     * Create a new User instance
     * @param {Object} data - User data
     */
    constructor(data = {}) {
      this.uid = data.uid || null;
      this.email = data.email || '';
      this.displayName = data.displayName || '';
      this.photoURL = data.photoURL || null;
      this.phoneNumber = data.phoneNumber || null;
      this.bio = data.bio || '';
      this.preferences = data.preferences || {};
      this.createdAt = data.createdAt || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
    }
  
    /**
     * Validate user data
     * @returns {Object} Validation result with errors if any
     */
    validate() {
      const errors = {};
  
      if (!this.uid) {
        errors.uid = 'User ID is required';
      }
  
      if (!this.email) {
        errors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        errors.email = 'Email format is invalid';
      }
  
      if (!this.displayName) {
        errors.displayName = 'Display name is required';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  
    /**
     * Convert user instance to plain object for storage
     * @returns {Object} User data as plain object
     */
    toObject() {
      return {
        uid: this.uid,
        email: this.email,
        displayName: this.displayName,
        photoURL: this.photoURL,
        phoneNumber: this.phoneNumber,
        bio: this.bio,
        preferences: this.preferences,
        createdAt: this.createdAt,
        updatedAt: new Date().toISOString()
      };
    }
  
    /**
     * Create User instance from plain object
     * @param {Object} data - User data
     * @returns {User} User instance
     */
    static fromObject(data) {
      return new User(data);
    }
  }
  
  module.exports = User;