 
// src/utils/compatibility.js

/**
 * Calculate compatibility score between two users based on their quiz answers
 * 
 * @param {Object} userAnswers - First user's quiz answers
 * @param {Object} otherUserAnswers - Second user's quiz answers
 * @returns {Object} Compatibility scores overall and by category
 */
exports.calculateCompatibility = (userAnswers, otherUserAnswers) => {
    // Define question categories
    const categories = {
      lifestyle: [1, 5, 7],           // Night/day, Temperature, TV
      cleaning: [2],                  // Cleaning style
      social: [3, 8],                 // Quiet/social, Guests
      food: [4, 9],                   // Cooking, Groceries
      routine: [6],                   // Shower time
      pets: [10]                      // Pet preference
    };
    
    let totalQuestions = 0;
    let matchingAnswers = 0;
    
    // Calculate category scores
    const categoryScores = {};
    
    Object.keys(categories).forEach(category => {
      const categoryQuestions = categories[category];
      let categoryTotal = 0;
      let categoryMatches = 0;
      
      categoryQuestions.forEach(questionId => {
        // Skip if either user didn't answer this question
        if (!userAnswers[questionId] || !otherUserAnswers[questionId]) {
          return;
        }
        
        categoryTotal++;
        totalQuestions++;
        
        // Check if answers match
        if (userAnswers[questionId] === otherUserAnswers[questionId]) {
          categoryMatches++;
          matchingAnswers++;
        }
      });
      
      // Calculate percentage score for this category
      const categoryScore = categoryTotal > 0 
        ? Math.round((categoryMatches / categoryTotal) * 100) 
        : 0;
        
      categoryScores[category] = categoryScore;
    });
    
    // Calculate overall compatibility percentage
    const overallScore = totalQuestions > 0 
      ? Math.round((matchingAnswers / totalQuestions) * 100) 
      : 0;
    
    // Weight certain categories more heavily for overall score
    // This is a simplified version - you could implement more complex algorithms
    const weightedOverallScore = overallScore;
    
    return {
      overall: weightedOverallScore,
      categories: categoryScores
    };
  };