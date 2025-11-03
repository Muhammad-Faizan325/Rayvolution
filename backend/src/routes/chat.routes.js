const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

// Send message
router.post('/', protect, chatController.sendMessage);

// Get chat history
router.get('/history', protect, chatController.getChatHistory);

// Clear chat history
router.delete('/history', protect, chatController.clearChatHistory);

module.exports = router;
