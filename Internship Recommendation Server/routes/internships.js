const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Internship = require('../models/Internship');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Caching recommendations for the current session to prevent hitting API quota
let cachedRecommendations = null;
let lastRecommendationFetch = 0;
const CACHE_DURATION_MS = 10 * 60 * 1000; // Cache for 10 minutes

// --- Helper function to safely parse AI response ---
const parseAIResponse = (text) => {
  try {
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
  }
  return [];
};

// --- Fallback recommendation logic ---
const fallbackRecommendations = (userProfile, allInternships) => {
  const userSkills = new Set(userProfile.skills);
  const userEducation = userProfile.education;
  const userInterests = userProfile.interests;

  const scoredInternships = allInternships.map(internship => {
    let score = 0;
    // Score based on matching skills
    internship.skills.forEach(skill => {
      if (userSkills.has(skill)) {
        score += 3;
      }
    });
    // Score based on matching education and interests
    if (userEducation && internship.title.includes(userEducation)) score += 2;
    if (userInterests && internship.sector.includes(userInterests)) score += 2;

    return { ...internship.toObject(), score };
  });

  const sorted = scoredInternships
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0);

  return sorted.slice(0, 5);
};


// @route   GET /api/internships/all
// @desc    Get all internships (for View All feature)
// @access  Private (requires authentication)
router.get('/all', auth, async (req, res) => {
  try {
    const allInternships = await Internship.find();
    res.json(allInternships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/internships/recommend
// @desc    Get AI-powered recommendations based on user's saved profile
// @access  Private (requires authentication)
router.get('/recommend', auth, async (req, res) => {
  try {
    // Return cached recommendations if available and not expired
    if (cachedRecommendations && (Date.now() - lastRecommendationFetch < CACHE_DURATION_MS)) {
      return res.json(cachedRecommendations);
    }

    const user = await User.findById(req.user.id).select('profile');
    const allInternships = await Internship.find();

    const aiPrompt = `
      You are an expert career counselor. Analyze the following user profile and internship listings. 
      Identify the top 3-5 most suitable internships. For each recommendation, provide a brief (1-2 sentences) justification explaining why it's a great match for the user's profile.
      User Profile: ${JSON.stringify(user.profile.toObject())}
      Available Internships: ${JSON.stringify(allInternships, null, 2)}
      Output the recommendations in a JSON array format, with each object containing 'title', 'sector', 'skills', 'location', and a new 'justification' field.
    `;
    
    let recommendations = [];
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(aiPrompt);
        const response = await result.response;
        const text = response.text();
        recommendations = parseAIResponse(text);
        
        // Cache the new recommendations
        cachedRecommendations = recommendations;
        lastRecommendationFetch = Date.now();
        
        res.json(recommendations);
    } catch (apiError) {
        console.error('AI recommendation error:', apiError);
        // Fallback to simple logic if AI fails
        const fallback = fallbackRecommendations(user.profile, allInternships);
        res.json(fallback);
    }
  } catch (err) {
    console.error('General recommendation error:', err);
    res.status(500).send('Failed to get AI recommendations. Please check your API key and try again.');
  }
});

// @route   POST /api/internships/refine
// @desc    Refine AI recommendations based on new user search criteria
// @access  Private (requires authentication)
router.post('/refine', auth, async (req, res) => {
  try {
    const { education, skills, interests } = req.body;
    const allInternships = await Internship.find();
    
    const skillsArray = Array.isArray(skills) ? skills.join(', ') : skills;
    
    const aiPrompt = `
      You are an expert career counselor. Analyze the following user search criteria and internship listings. 
      Identify the top 3-5 most suitable internships. For each recommendation, provide a brief (1-2 sentences) justification.
      User search criteria:
      - Education: ${education || 'Not specified'}
      - Skills: ${skillsArray || 'Not specified'}
      - Interests: ${interests || 'Not specified'}
      Available Internships: ${JSON.stringify(allInternships, null, 2)}
      Output the recommendations in a JSON array format, with each object containing 'title', 'sector', 'skills', 'location', and a new 'justification' field.
    `;
    
    let recommendations = [];
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(aiPrompt);
        const response = await result.response;
        const text = response.text();
        recommendations = parseAIResponse(text);
        res.json(recommendations);
    } catch (apiError) {
        console.error('AI refinement error:', apiError);
        // Fallback to simple logic if AI fails
        const userProfile = { education, skills, interests };
        const fallback = fallbackRecommendations(userProfile, allInternships);
        res.json(fallback);
    }
  } catch (err) {
    console.error('General refinement error:', err);
    res.status(500).send('Failed to get AI recommendations. Please check your API key and try again.');
  }
});

module.exports = router;