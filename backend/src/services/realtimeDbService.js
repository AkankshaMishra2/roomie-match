// src/services/realtimeDbService.js
const { realtimeDb } = require('../config/firebase');

/**
 * Generic service for Firebase Realtime Database operations
 */
class RealtimeDbService {
  constructor(basePath) {
    this.basePath = basePath;
  }

  /**
   * Get reference to a path
   * @param {string} path - Path to reference
   * @returns {object} Firebase reference
   */
  getRef(path = '') {
    const fullPath = path ? `${this.basePath}/${path}` : this.basePath;
    return realtimeDb.ref(fullPath);
  }

  /**
   * Set data at a path
   * @param {string} path - Path to set data at
   * @param {any} data - Data to set
   * @returns {Promise<void>}
   */
  async set(path, data) {
    const ref = this.getRef(path);
    await ref.set(data);
  }

  /**
   * Update data at a path
   * @param {string} path - Path to update data at
   * @param {object} updates - Updates to apply
   * @returns {Promise<void>}
   */
  async update(path, updates) {
    const ref = this.getRef(path);
    await ref.update(updates);
  }

  /**
   * Read data from a path
   * @param {string} path - Path to read from
   * @returns {Promise<any>} Data at the path
   */
  async get(path) {
    const ref = this.getRef(path);
    const snapshot = await ref.once('value');
    return snapshot.val();
  }

  /**
   * Delete data at a path
   * @param {string} path - Path to delete
   * @returns {Promise<void>}
   */
  async remove(path) {
    const ref = this.getRef(path);
    await ref.remove();
  }

  /**
   * Push data to a list
   * @param {string} path - Path to push to
   * @param {any} data - Data to push
   * @returns {Promise<string>} Generated key
   */
  async push(path, data) {
    const ref = this.getRef(path);
    const newRef = ref.push();
    await newRef.set({
      ...data,
      id: newRef.key,
      timestamp: data.timestamp || new Date().toISOString()
    });
    return newRef.key;
  }

  /**
   * Subscribe to data changes at a path
   * @param {string} path - Path to subscribe to
   * @param {function} callback - Callback to call with new data
   * @returns {function} Unsubscribe function
   */
  subscribe(path, callback) {
    const ref = this.getRef(path);
    ref.on('value', (snapshot) => {
      callback(snapshot.val());
    });
    
    // Return unsubscribe function
    return () => ref.off('value');
  }

  /**
   * Subscribe to child added events
   * @param {string} path - Path to subscribe to
   * @param {function} callback - Callback to call with new child
   * @returns {function} Unsubscribe function
   */
  subscribeToAdded(path, callback) {
    const ref = this.getRef(path);
    ref.on('child_added', (snapshot) => {
      callback(snapshot.val());
    });
    
    // Return unsubscribe function
    return () => ref.off('child_added');
  }

  /**
   * Query data
   * @param {string} path - Path to query
   * @param {string} orderByChild - Child key to order by
   * @param {any} equalTo - Value to match
   * @param {number} limitToLast - Limit to last N results
   * @returns {Promise<object>} Query results
   */
  async query(path, orderByChild, equalTo, limitToLast) {
    let ref = this.getRef(path);
    
    if (orderByChild) {
      ref = ref.orderByChild(orderByChild);
    }
    
    if (equalTo !== undefined) {
      ref = ref.equalTo(equalTo);
    }
    
    if (limitToLast) {
      ref = ref.limitToLast(limitToLast);
    }
    
    const snapshot = await ref.once('value');
    const results = {};
    
    snapshot.forEach((childSnapshot) => {
      results[childSnapshot.key] = childSnapshot.val();
    });
    
    return results;
  }

  /**
   * Count children at a path
   * @param {string} path - Path to count
   * @returns {Promise<number>} Count of children
   */
  async countChildren(path) {
    const snapshot = await this.getRef(path).once('value');
    let count = 0;
    
    snapshot.forEach(() => {
      count++;
    });
    
    return count;
  }

  /**
   * Transaction to safely update a value
   * @param {string} path - Path to update
   * @param {function} updateFn - Function to transform current value
   * @returns {Promise<object>} Result with committed status and value
   */
  async transaction(path, updateFn) {
    const ref = this.getRef(path);
    return ref.transaction(updateFn);
  }

  /**
   * Get all keys at a path
   * @param {string} path - Path to get keys from
   * @returns {Promise<string[]>} Array of keys
   */
  async getKeys(path) {
    const snapshot = await this.getRef(path).once('value');
    const keys = [];
    
    snapshot.forEach((childSnapshot) => {
      keys.push(childSnapshot.key);
    });
    
    return keys;
  }
}

module.exports = RealtimeDbService;