 
// src/models/Mood.js
/**
 * Mood model - defines the structure and validation for mood data
 */
class Mood {
    /**
     * Create a new Mood instance
     * @param {Object} data - Mood data
     */
    constructor(data = {}) {
      this.userId = data.userId || null;
      this.mood = data.mood || null;
      this.status = data.status || '';
      this.timestamp = data.timestamp || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
    }
  
    /**
     * Validate mood data
     * @returns {Object} Validation result with errors if any
     */
    validate() {
      const errors = {};
      const validMoods = ['happy', 'sad', 'busy', 'relaxed', 'tired', 'productive', 'stressed', 'social'];
  
      if (!this.userId) {
        errors.userId = 'User ID is required';
      }
  
      if (!this.mood) {
        errors.mood = 'Mood is required';
      } else if (!validMoods.includes(this.mood)) {
        errors.mood = `Mood must be one of: ${validMoods.join(', ')}`;
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  
    /**
     * Convert mood instance to plain object for storage
     * @returns {Object} Mood data as plain object
     */
    toObject() {
      return {
        userId: this.userId,
        mood: this.mood,
        status: this.status,
        timestamp: this.timestamp,
        updatedAt: new Date().toISOString()
      };
    }
  
    /**
     * Create Mood instance from plain object
     * @param {Object} data - Mood data
     * @returns {Mood} Mood instance
     */
    static fromObject(data) {
      return new Mood(data);
    }
  
    /**
     * Get available mood options
     * @returns {Array} List of valid moods
     */
    static getValidMoods() {
      return [
        { id: 'happy', label: 'Happy', emoji: '😊' },
        { id: 'sad', label: 'Sad', emoji: '😢' },
        { id: 'busy', label: 'Busy', emoji: '🏃‍♂️' },
        { id: 'relaxed', label: 'Relaxed', emoji: '😌' },
        { id: 'tired', label: 'Tired', emoji: '😴' },
        { id: 'productive', label: 'Productive', emoji: '💪' },
        { id: 'stressed', label: 'Stressed', emoji: '😰' },
        { id: 'social', label: 'Social', emoji: '🎉' }
      ];
    }
  }
  
  module.exports = Mood;