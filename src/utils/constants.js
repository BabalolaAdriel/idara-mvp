// Application Constants

export const APP_CONFIG = {
  name: 'Idara',
  version: '1.0.0',
  description: 'AI-Powered Lecture Companion for Students',
  tagline: 'Never miss a moment. Record, transcribe, and transform your lectures.',
};

// Audio Configuration
export const AUDIO_CONFIG = {
  sampleRate: 16000,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  mimeType: 'audio/webm;codecs=opus',
  chunkInterval: 10000, // 10 seconds
  autoSaveInterval: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  veo: 'https://generativelanguage.googleapis.com/v1beta/models/veo-3:generateContent',
};

// Gemini Configuration
export const GEMINI_CONFIG = {
  temperature: 0.4,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
};

// Storage Configuration
export const STORAGE_CONFIG = {
  dbName: 'IdaraDB',
  version: 1,
  maxLectures: 10,
  maxAudioSize: 100 * 1024 * 1024, // 100MB
};

// UI Constants
export const UI_CONSTANTS = {
  minTranscriptLength: 50,
  maxTitleLength: 100,
  maxTagLength: 20,
  maxTags: 5,
  waveformHeight: 100,
  waveformBars: 50,
};

// Video Configuration
export const VIDEO_CONFIG = {
  durations: [15, 30, 60],
  styles: [
    { value: 'educational', label: 'Educational Whiteboard' },
    { value: '3d', label: '3D Animation' },
    { value: 'infographic', label: 'Infographic' },
  ],
  maxConcepts: 5,
};

// Error Messages
export const ERROR_MESSAGES = {
  microphonePermission: 'Microphone access denied. Please enable microphone permissions in your browser settings.',
  whisperLoadFailed: 'Failed to load transcription model. Please check your connection or try again.',
  apiKeyMissing: 'API key not configured. Please add your API key in Settings.',
  networkTimeout: 'Network request timed out. Please check your connection.',
  storageQuotaExceeded: 'Storage quota exceeded. Please delete some lectures to free up space.',
  invalidTranscript: 'Transcript is too short or invalid. Please record more content.',
};

// Rate Limiting
export const RATE_LIMIT_CONFIG = {
  maxRetries: 4,
  initialDelay: 2000, // 2 seconds
  maxDelay: 16000, // 16 seconds
  backoffMultiplier: 2,
};

// Transcription Quality Levels
export const TRANSCRIPTION_QUALITY = {
  standard: { model: 'whisper-tiny.en', size: 39 },
  high: { model: 'whisper-base.en', size: 74 },
};

// Note Sections
export const NOTE_SECTIONS = [
  { id: 'summary', title: 'Executive Summary', icon: '📋' },
  { id: 'concepts', title: 'Key Concepts', icon: '🎯' },
  { id: 'formulas', title: 'Formulas & Equations', icon: '📐' },
  { id: 'definitions', title: 'Definitions & Terminology', icon: '📖' },
  { id: 'questions', title: 'Practice Questions', icon: '❓' },
  { id: 'reviewPoints', title: 'Quick Review Points', icon: '⚡' },
  { id: 'studyTips', title: 'Study Tips', icon: '💡' },
];
