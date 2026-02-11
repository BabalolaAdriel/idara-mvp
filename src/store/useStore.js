// Zustand Store with Persist Middleware

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Recording state
      isRecording: false,
      isPaused: false,
      currentLecture: null,
      recordingDuration: 0,

      // Network status
      isOnline: navigator.onLine,

      // Settings
      settings: {
        autoSave: true,
        transcriptionQuality: 'standard',
        geminiApiKey: '',
        veoApiKey: '',
      },

      // UI state
      sidebarOpen: true,
      currentPage: 'home',

      // Actions
      startRecording: () => set({ isRecording: true, isPaused: false }),
      
      stopRecording: () => set({ isRecording: false, isPaused: false, recordingDuration: 0 }),
      
      pauseRecording: () => set({ isPaused: true }),
      
      resumeRecording: () => set({ isPaused: false }),

      setRecordingDuration: (duration) => set({ recordingDuration: duration }),

      setCurrentLecture: (lecture) => set({ currentLecture: lecture }),

      setOnlineStatus: (status) => set({ isOnline: status }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setCurrentPage: (page) => set({ currentPage: page }),

      // Reset state
      reset: () => set({
        isRecording: false,
        isPaused: false,
        currentLecture: null,
        recordingDuration: 0,
      }),
    }),
    {
      name: 'idara-storage', // LocalStorage key
      partialize: (state) => ({
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
        // Don't persist temporary state
      }),
    }
  )
);

export default useStore;
