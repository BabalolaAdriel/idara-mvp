// useStorage Hook

import { useState, useEffect, useCallback } from 'react';
import {
  saveLecture as saveLectureService,
  getLectures as getLecturesService,
  getLecture as getLectureService,
  updateLecture as updateLectureService,
  deleteLecture as deleteLectureService,
  searchLectures as searchLecturesService,
  getStorageStats as getStorageStatsService,
  clearAllLectures as clearAllLecturesService,
  exportLectures as exportLecturesService,
} from '../services/storageService.js';

export default function useStorage() {
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Load all lectures
  const loadLectures = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getLecturesService();
      setLectures(data);
      return data;
    } catch (err) {
      console.error('Error loading lectures:', err);
      setError(err.message || 'Failed to load lectures');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load single lecture
  const loadLecture = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const lecture = await getLectureService(id);
      setCurrentLecture(lecture);
      return lecture;
    } catch (err) {
      console.error('Error loading lecture:', err);
      setError(err.message || 'Failed to load lecture');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save lecture
  const saveLecture = useCallback(async (lecture) => {
    try {
      setError(null);
      const id = await saveLectureService(lecture);
      await loadLectures(); // Reload list
      return id;
    } catch (err) {
      console.error('Error saving lecture:', err);
      setError(err.message || 'Failed to save lecture');
      throw err;
    }
  }, [loadLectures]);

  // Update lecture
  const updateLecture = useCallback(async (id, updates) => {
    try {
      setError(null);
      await updateLectureService(id, updates);
      await loadLectures(); // Reload list
      
      // Update current lecture if it's the one being updated
      if (currentLecture && currentLecture.id === id) {
        const updated = await getLectureService(id);
        setCurrentLecture(updated);
      }
      
      return true;
    } catch (err) {
      console.error('Error updating lecture:', err);
      setError(err.message || 'Failed to update lecture');
      return false;
    }
  }, [loadLectures, currentLecture]);

  // Delete lecture
  const deleteLecture = useCallback(async (id) => {
    try {
      setError(null);
      await deleteLectureService(id);
      await loadLectures(); // Reload list
      
      // Clear current lecture if it was deleted
      if (currentLecture && currentLecture.id === id) {
        setCurrentLecture(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting lecture:', err);
      setError(err.message || 'Failed to delete lecture');
      return false;
    }
  }, [loadLectures, currentLecture]);

  // Search lectures
  const searchLectures = useCallback(async (query) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await searchLecturesService(query);
      setLectures(results);
      return results;
    } catch (err) {
      console.error('Error searching lectures:', err);
      setError(err.message || 'Failed to search lectures');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get storage statistics
  const loadStats = useCallback(async () => {
    try {
      const storageStats = await getStorageStatsService();
      setStats(storageStats);
      return storageStats;
    } catch (err) {
      console.error('Error loading stats:', err);
      return null;
    }
  }, []);

  // Clear all lectures
  const clearAll = useCallback(async () => {
    try {
      setError(null);
      await clearAllLecturesService();
      setLectures([]);
      setCurrentLecture(null);
      setStats(null);
      return true;
    } catch (err) {
      console.error('Error clearing lectures:', err);
      setError(err.message || 'Failed to clear lectures');
      return false;
    }
  }, []);

  // Export lectures
  const exportData = useCallback(async () => {
    try {
      const json = await exportLecturesService();
      
      // Create download
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `idara-lectures-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      console.error('Error exporting lectures:', err);
      setError(err.message || 'Failed to export lectures');
      return false;
    }
  }, []);

  // Load lectures on mount
  useEffect(() => {
    loadLectures();
    loadStats();
  }, []);

  return {
    lectures,
    currentLecture,
    isLoading,
    error,
    stats,
    loadLectures,
    loadLecture,
    saveLecture,
    updateLecture,
    deleteLecture,
    searchLectures,
    loadStats,
    clearAll,
    exportData,
  };
}
