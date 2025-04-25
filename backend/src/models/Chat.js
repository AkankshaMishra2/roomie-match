 
// src/models/Chat.js
/**
 * Chat model - defines the structure and validation for chat data
 */
class Chat {
    /**
     * Create a new Chat instance
     * @param {Object} data - Chat data
     */
    constructor(data = {}) {
      this.id = data.id || null;
      this.participants = data.participants || [];
      this.lastMessage = data.lastMessage || '';
      this.lastMessageTimestamp = data.lastMessageTimestamp || null;
      this.lastMessageSenderId = data.lastMessageSenderId || null;
      this.createdAt = data.createdAt || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
    }
  
    /**
     * Validate chat data
     * @returns {Object} Validation result with errors if any
     */
    validate() {
      const errors = {};
  
      if (!this.participants || this.participants.length < 2) {
        errors.participants = 'At least two participants are required';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  
    /**
     * Convert chat instance to plain object for storage
     * @returns {Object} Chat data as plain object
     */
    toObject() {
      return {
        id: this.id,
        participants: this.participants,
        lastMessage: this.lastMessage,
        lastMessageTimestamp: this.lastMessageTimestamp,
        lastMessageSenderId: this.lastMessageSenderId,
        createdAt: this.createdAt,
        updatedAt: new Date().toISOString()
      };
    }
  
    /**
     * Create Chat instance from plain object
     * @param {Object} data - Chat data
     * @returns {Chat} Chat instance
     */
    static fromObject(data) {
      return new Chat(data);
    }
  
    /**
     * Message model for chat messages
     */
    static Message = class Message {
      /**
       * Create a new Message instance
       * @param {Object} data - Message data
       */
      constructor(data = {}) {
        this.id = data.id || null;
        this.chatId = data.chatId || null;
        this.text = data.text || '';
        this.senderId = data.senderId || null;
        this.senderName = data.senderName || 'Anonymous';
        this.receiverId = data.receiverId || null;
        this.timestamp = data.timestamp || new Date().toISOString();
        this.read = data.read || false;
      }
  
      /**
       * Validate message data
       * @returns {Object} Validation result with errors if any
       */
      validate() {
        const errors = {};
  
        if (!this.chatId) {
          errors.chatId = 'Chat ID is required';
        }
  
        if (!this.text.trim()) {
          errors.text = 'Message text is required';
        }
  
        if (!this.senderId) {
          errors.senderId = 'Sender ID is required';
        }
  
        if (!this.receiverId) {
          errors.receiverId = 'Receiver ID is required';
        }
  
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
  
      /**
       * Convert message instance to plain object for storage
       * @returns {Object} Message data as plain object
       */
      toObject() {
        return {
          id: this.id,
          chatId: this.chatId,
          text: this.text,
          senderId: this.senderId,
          senderName: this.senderName,
          receiverId: this.receiverId,
          timestamp: this.timestamp,
          read: this.read
        };
      }
    };
  }
  
  module.exports = Chat;