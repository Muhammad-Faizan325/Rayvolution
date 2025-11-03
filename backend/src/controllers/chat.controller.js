const ChatMessage = require('../models/ChatMessage.model');
const { sendSuccess, sendError } = require('../utils/response.utils');
const axios = require('axios');

// @desc    Send chat message and get AI response
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return sendError(res, 'Message is required', 400);
    }

    // Save user message
    await ChatMessage.create({
      userId: req.user._id,
      role: 'user',
      content: message
    });

    let aiResponse = '';

    // If GROQ API key is available, use it
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'mixtral-8x7b-32768',
            messages: [
              {
                role: 'system',
                content: 'You are EcoBot, an AI assistant for Rayvolution - a solar energy platform for Pakistan. Help users with solar energy information, energy savings tips, and platform features. Be friendly and informative.'
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        aiResponse = response.data.choices[0].message.content;
      } catch (apiError) {
        console.error('GROQ API error:', apiError.response?.data || apiError.message);
        aiResponse = 'I apologize, but I am having trouble connecting to the AI service right now. Please try again later.';
      }
    } else {
      // Fallback response if no API key
      aiResponse = getDefaultResponse(message);
    }

    // Save AI response
    await ChatMessage.create({
      userId: req.user._id,
      role: 'assistant',
      content: aiResponse,
      metadata: {
        model: process.env.GROQ_API_KEY ? 'mixtral-8x7b-32768' : 'fallback'
      }
    });

    sendSuccess(res, { response: aiResponse }, 'Message sent successfully');
  } catch (error) {
    console.error('Send message error:', error);
    sendError(res, 'Error processing message', 500);
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    sendSuccess(res, { messages: messages.reverse() }, 'Chat history retrieved successfully');
  } catch (error) {
    console.error('Get chat history error:', error);
    sendError(res, 'Error retrieving chat history', 500);
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
exports.clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id });

    sendSuccess(res, null, 'Chat history cleared successfully');
  } catch (error) {
    console.error('Clear chat history error:', error);
    sendError(res, 'Error clearing chat history', 500);
  }
};

// Fallback responses when API is not available
function getDefaultResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('solar') || lowerMessage.includes('panel')) {
    return 'Solar panels are a great way to reduce energy costs and help the environment! In Pakistan, solar energy is becoming increasingly popular due to abundant sunlight. Would you like to know more about solar adoption in your city?';
  } else if (lowerMessage.includes('energy') || lowerMessage.includes('saving')) {
    return 'Here are some energy saving tips: 1) Use LED bulbs, 2) Unplug devices when not in use, 3) Use natural lighting during the day, 4) Maintain your appliances regularly. Track your progress in the dashboard!';
  } else if (lowerMessage.includes('challenge')) {
    return 'Check out our EcoChallenges! Complete daily and weekly challenges to earn GreenCoins and Energy Tokens. Visit the Challenges page to get started!';
  } else if (lowerMessage.includes('marketplace') || lowerMessage.includes('trade')) {
    return 'Our marketplace allows you to trade Energy Tokens with other users or donate to energy-deficient regions. You earn tokens by saving energy through solar panels!';
  } else if (lowerMessage.includes('greencoin')) {
    return 'GreenCoins are our reward currency! Earn them by completing challenges, saving energy, and contributing to the community. Use them to purchase Energy Tokens in the marketplace.';
  } else {
    return 'Hello! I\'m EcoBot, your solar energy assistant. I can help you with information about solar panels, energy savings, challenges, marketplace, and more. What would you like to know?';
  }
}

module.exports = exports;
