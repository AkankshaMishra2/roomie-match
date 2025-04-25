 
// src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// Send a message
router.post('/:chatId/messages', authMiddleware, chatController.sendMessage);

// Get messages for a chat
router.get('/:chatId/messages', authMiddleware, chatController.getMessages);

// Get user chats
router.get('/user/:userId', authMiddleware, chatController.getUserChats);

// Mark messages as read
router.put('/:chatId/read/:userId', authMiddleware, chatController.markAsRead);

module.exports = router;