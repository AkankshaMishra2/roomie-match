 
// src/services/firestoreService.js
const { db } = require('../config/firebase');

/**
 * Generic service for Firestore operations
 */
class FirestoreService {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  /**
   * Create a document with given ID
   * @param {string} id - Document ID
   * @param {object} data - Document data
   * @returns {Promise<object>} Created document
   */
  async create(id, data) {
    const docRef = this.collection.doc(id);
    await docRef.set({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Create a document with auto-generated ID
   * @param {object} data - Document data
   * @returns {Promise<object>} Created document
   */
  async add(data) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Get a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<object|null>} Document data or null if not found
   */
  async get(id) {
    const doc = await this.collection.doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Update a document by ID
   * @param {string} id - Document ID
   * @param {object} data - Data to update
   * @returns {Promise<object>} Updated document
   */
  async update(id, data) {
    const docRef = this.collection.doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  /**
   * Delete a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }

  /**
   * Get all documents in the collection
   * @returns {Promise<Array>} Array of documents
   */
  async getAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /**
   * Query documents with filters
   * @param {Array} filters - Array of filter configs: [field, operator, value]
   * @param {string} orderByField - Field to order by
   * @param {string} orderDirection - Order direction ('asc' or 'desc')
   * @param {number} limit - Maximum number of documents
   * @returns {Promise<Array>} Array of documents
   */
  async query(filters = [], orderByField = 'createdAt', orderDirection = 'desc', limit = 0) {
    let query = this.collection;
    
    // Apply filters
    filters.forEach(filter => {
      const [field, operator, value] = filter;
      query = query.where(field, operator, value);
    });
    
    // Apply ordering
    if (orderByField) {
      query = query.orderBy(orderByField, orderDirection);
    }
    
    // Apply limit
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
  
  /**
   * Check if a document exists
   * @param {string} id - Document ID
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists;
  }
}

module.exports = FirestoreService;