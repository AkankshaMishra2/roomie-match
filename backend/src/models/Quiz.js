 
// src/models/Quiz.js
/**
 * Quiz model - defines the structure and validation for quiz data
 */
class Quiz {
    /**
     * Create a new Quiz instance
     * @param {Object} data - Quiz data
     */
    constructor(data = {}) {
      this.userId = data.userId || null;
      this.answers = data.answers || {};
      this.timestamp = data.timestamp || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
    }
  
    /**
     * Validate quiz data
     * @returns {Object} Validation result with errors if any
     */
    validate() {
      const errors = {};
  
      if (!this.userId) {
        errors.userId = 'User ID is required';
      }
  
      if (!this.answers || Object.keys(this.answers).length === 0) {
        errors.answers = 'Quiz answers are required';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  
    /**
     * Convert quiz instance to plain object for storage
     * @returns {Object} Quiz data as plain object
     */
    toObject() {
      return {
        userId: this.userId,
        answers: this.answers,
        timestamp: this.timestamp,
        updatedAt: new Date().toISOString()
      };
    }
  
    /**
     * Create Quiz instance from plain object
     * @param {Object} data - Quiz data
     * @returns {Quiz} Quiz instance
     */
    static fromObject(data) {
      return new Quiz(data);
    }
  
    /**
     * Get available quiz questions
     * @returns {Array} List of quiz questions
     */
    static getQuestions() {
      return [
        {
          id: 1,
          question: "Night owl or early bird?",
          options: ["Night owl", "Early bird"],
          category: "lifestyle"
        },
        {
          id: 2,
          question: "Clean as you go or deep clean once a week?",
          options: ["Clean as you go", "Deep clean once a week"],
          category: "cleaning"
        },
        {
          id: 3,
          question: "Do you prefer quiet time or social activity at home?",
          options: ["Quiet time", "Social activity"],
          category: "social"
        },
        {
          id: 4,
          question: "Do you cook often or order takeout?",
          options: ["Cook often", "Order takeout"],
          category: "food"
        },
        {
          id: 5,
          question: "What's your preferred room temperature?",
          options: ["Cool", "Warm"],
          category: "lifestyle"
        },
        {
          id: 6,
          question: "Are you a morning or evening shower person?",
          options: ["Morning", "Evening"],
          category: "routine"
        },
        {
          id: 7,
          question: "TV in common areas - on or off most of the time?",
          options: ["On", "Off"],
          category: "lifestyle"
        },
        {
          id: 8,
          question: "How do you feel about guests?",
          options: ["Frequently welcome", "Occasionally welcome", "Rarely welcome"],
          category: "social"
        },
        {
          id: 9,
          question: "How do you prefer to handle groceries?",
          options: ["Share everything", "Some shared, some separate", "Completely separate"],
          category: "food"
        },
        {
          id: 10,
          question: "What's your pet preference?",
          options: ["Love pets", "No pets", "Some pets are ok"],
          category: "pets"
        }
      ];
    }
  }
  
  module.exports = Quiz;