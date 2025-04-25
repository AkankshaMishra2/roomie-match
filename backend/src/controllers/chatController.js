// src/controllers/chatController.js
const { db, realtimeDb } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text, senderId, senderName, receiverId, timestamp } = req.body;
    
    if (!chatId || !text || !senderId || !receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chat ID, message text, sender ID, and receiver ID are required' 
      });
    }

    const messageId = uuidv4();
    const messageData = {
      id: messageId,
      text,
      senderId,
      senderName: senderName || 'Anonymous',
      receiverId,
      timestamp: timestamp || new Date().toISOString(),
      read: false
    };

    // Store message in Realtime Database
    const chatRef = realtimeDb.ref(`chats/${chatId}/messages/${messageId}`);
    await chatRef.set(messageData);

    // Update last message in Firestore for quick access
    const chatDocRef = db.collection('chats').doc(chatId);
    await chatDocRef.set({
      lastMessage: text,
      lastMessageTimestamp: messageData.timestamp,
      lastMessageSenderId: senderId,
      participants: [senderId, receiverId],
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: messageData
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get messages for a chat
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50 } = req.query;
    
    if (!chatId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chat ID is required' 
      });
    }

    // Get messages from Realtime Database
    const messagesRef = realtimeDb.ref(`chats/${chatId}/messages`);
    const messagesSnapshot = await messagesRef.orderByChild('timestamp').limitToLast(parseInt(limit)).once('value');
    
    const messages = [];
    messagesSnapshot.forEach((childSnapshot) => {
      messages.push(childSnapshot.val());
    });

    // Sort by timestamp
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages',
      error: error.message
    });
  }
};

// Get user chats
exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Get chats where user is a participant
    const chatsSnapshot = await db.collection('chats')
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageTimestamp', 'desc')
      .get();
    
    const chats = [];
    
    for (const doc of chatsSnapshot.docs) {
      const chatData = doc.data();
      const chatId = doc.id;
      
      // Find the other participant
      const otherParticipantId = chatData.participants.find(id => id !== userId);
      
      // Get other participant details
      const userDoc = await db.collection('users').doc(otherParticipantId).get();
      const userData = userDoc.exists ? userDoc.data() : { displayName: 'Unknown User' };
      
      // Get unread count
      const unreadCountRef = realtimeDb.ref(`chats/${chatId}/unreadCounts/${userId}`);
      const unreadCountSnapshot = await unreadCountRef.once('value');
      const unreadCount = unreadCountSnapshot.val() || 0;
      
      chats.push({
        id: chatId,
        participantId: otherParticipantId,
        participantName: userData.displayName,
        participantPhoto: userData.photoURL || null,
        lastMessage: chatData.lastMessage,
        lastMessageTimestamp: chatData.lastMessageTimestamp,
        unreadCount
      });
    }

    res.status(200).json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Error getting user chats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user chats',
      error: error.message
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId, userId } = req.params;
    
    if (!chatId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chat ID and User ID are required' 
      });
    }

    // Reset unread count for the user
    const unreadCountRef = realtimeDb.ref(`chats/${chatId}/unreadCounts/${userId}`);
    await unreadCountRef.set(0);

    // Mark messages as read
    const messagesRef = realtimeDb.ref(`chats/${chatId}/messages`);
    const messagesSnapshot = await messagesRef.orderByChild('receiverId').equalTo(userId).once('value');
    
    const updates = {};
    messagesSnapshot.forEach((childSnapshot) => {
      const messageKey = childSnapshot.key;
      const messageData = childSnapshot.val();
      
      if (!messageData.read) {
        updates[`${messageKey}/read`] = true;
      }
    });

    if (Object.keys(updates).length > 0) {
      await messagesRef.update(updates);
    }

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};