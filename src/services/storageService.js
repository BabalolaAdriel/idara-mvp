// Storage Service using Dexie.js

import Dexie from 'dexie';
import { STORAGE_CONFIG } from '../utils/constants.js';

// Initialize Dexie database
const db = new Dexie(STORAGE_CONFIG.dbName);

db.version(STORAGE_CONFIG.version).stores({
  lectures: '++id, title, date, duration, isProcessed, *tags',
});

/**
 * Save a new lecture
 * @param {Object} lecture - Lecture object
 * @returns {Promise<number>} Lecture ID
 */
export async function saveLecture(lecture) {
  try {
    // Ensure we don't exceed max lectures
    const count = await db.lectures.count();
    if (count >= STORAGE_CONFIG.maxLectures) {
      // Delete oldest lecture
      const oldest = await db.lectures.orderBy('date').first();
      if (oldest) {
        await deleteLecture(oldest.id);
      }
    }

    const id = await db.lectures.add({
      ...lecture,
      date: lecture.date || Date.now(),
      isProcessed: lecture.isProcessed || false,
      tags: lecture.tags || [],
    });

    return id;
  } catch (error) {
    console.error('Error saving lecture:', error);
    throw error;
  }
}

/**
 * Get all lectures (last 10, reverse chronological)
 * @returns {Promise<Array>} Array of lectures
 */
export async function getLectures() {
  try {
    const lectures = await db.lectures
      .orderBy('date')
      .reverse()
      .limit(STORAGE_CONFIG.maxLectures)
      .toArray();

    return lectures;
  } catch (error) {
    console.error('Error getting lectures:', error);
    throw error;
  }
}

/**
 * Get a single lecture by ID
 * @param {number} id - Lecture ID
 * @returns {Promise<Object>} Lecture object
 */
export async function getLecture(id) {
  try {
    const lecture = await db.lectures.get(id);
    return lecture;
  } catch (error) {
    console.error('Error getting lecture:', error);
    throw error;
  }
}

/**
 * Update an existing lecture
 * @param {number} id - Lecture ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<number>} Number of updated records
 */
export async function updateLecture(id, updates) {
  try {
    const result = await db.lectures.update(id, updates);
    return result;
  } catch (error) {
    console.error('Error updating lecture:', error);
    throw error;
  }
}

/**
 * Delete a lecture
 * @param {number} id - Lecture ID
 * @returns {Promise<void>}
 */
export async function deleteLecture(id) {
  try {
    await db.lectures.delete(id);
  } catch (error) {
    console.error('Error deleting lecture:', error);
    throw error;
  }
}

/**
 * Search lectures by title or tags
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching lectures
 */
export async function searchLectures(query) {
  try {
    const lowercaseQuery = query.toLowerCase();
    const lectures = await db.lectures
      .filter(lecture => {
        const titleMatch = lecture.title.toLowerCase().includes(lowercaseQuery);
        const tagMatch = lecture.tags.some(tag => 
          tag.toLowerCase().includes(lowercaseQuery)
        );
        return titleMatch || tagMatch;
      })
      .toArray();

    return lectures;
  } catch (error) {
    console.error('Error searching lectures:', error);
    throw error;
  }
}

/**
 * Export lectures as JSON
 * @returns {Promise<string>} JSON string of all lectures
 */
export async function exportLectures() {
  try {
    const lectures = await getLectures();
    // Remove audio blobs for export (too large)
    const exportData = lectures.map(lecture => ({
      ...lecture,
      audioBlob: null,
    }));
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting lectures:', error);
    throw error;
  }
}

/**
 * Get storage usage statistics
 * @returns {Promise<Object>} Storage stats
 */
export async function getStorageStats() {
  try {
    const lectures = await getLectures();
    const count = lectures.length;
    
    let totalSize = 0;
    for (const lecture of lectures) {
      if (lecture.audioBlob) {
        totalSize += lecture.audioBlob.size;
      }
    }

    const totalDuration = lectures.reduce((sum, l) => sum + (l.duration || 0), 0);
    const processedCount = lectures.filter(l => l.isProcessed).length;

    return {
      count,
      totalSize,
      totalDuration,
      processedCount,
      unprocessedCount: count - processedCount,
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    throw error;
  }
}

/**
 * Clear all lectures
 * @returns {Promise<void>}
 */
export async function clearAllLectures() {
  try {
    await db.lectures.clear();
  } catch (error) {
    console.error('Error clearing lectures:', error);
    throw error;
  }
}

export default db;
