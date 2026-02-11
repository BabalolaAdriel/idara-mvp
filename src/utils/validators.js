// Validation Utility Functions

import { UI_CONSTANTS, STORAGE_CONFIG } from './constants.js';

/**
 * Validate transcript content
 * @param {string} text - Transcript text
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateTranscript(text) {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Transcript is empty or invalid' };
  }
  
  const trimmed = text.trim();
  if (trimmed.length < UI_CONSTANTS.minTranscriptLength) {
    return {
      isValid: false,
      error: `Transcript must be at least ${UI_CONSTANTS.minTranscriptLength} characters long`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate API key format
 * @param {string} key - API key
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateApiKey(key) {
  if (!key || typeof key !== 'string') {
    return { isValid: false, error: 'API key is required' };
  }
  
  const trimmed = key.trim();
  if (trimmed.length < 20) {
    return { isValid: false, error: 'API key appears to be too short' };
  }
  
  return { isValid: true };
}

/**
 * Validate audio blob
 * @param {Blob} blob - Audio blob
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateAudioBlob(blob) {
  if (!blob || !(blob instanceof Blob)) {
    return { isValid: false, error: 'Invalid audio blob' };
  }
  
  if (blob.size === 0) {
    return { isValid: false, error: 'Audio blob is empty' };
  }
  
  if (blob.size > STORAGE_CONFIG.maxAudioSize) {
    return {
      isValid: false,
      error: `Audio file is too large (max ${STORAGE_CONFIG.maxAudioSize / 1024 / 1024}MB)`
    };
  }
  
  if (!blob.type.includes('audio')) {
    return { isValid: false, error: 'File is not an audio type' };
  }
  
  return { isValid: true };
}

/**
 * Validate lecture title
 * @param {string} title - Lecture title
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateTitle(title) {
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: 'Title is required' };
  }
  
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Title cannot be empty' };
  }
  
  if (trimmed.length > UI_CONSTANTS.maxTitleLength) {
    return {
      isValid: false,
      error: `Title must be less than ${UI_CONSTANTS.maxTitleLength} characters`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate tags array
 * @param {string[]} tags - Tags array
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateTags(tags) {
  if (!Array.isArray(tags)) {
    return { isValid: false, error: 'Tags must be an array' };
  }
  
  if (tags.length > UI_CONSTANTS.maxTags) {
    return {
      isValid: false,
      error: `Maximum ${UI_CONSTANTS.maxTags} tags allowed`
    };
  }
  
  for (const tag of tags) {
    if (typeof tag !== 'string' || tag.trim().length === 0) {
      return { isValid: false, error: 'All tags must be non-empty strings' };
    }
    
    if (tag.length > UI_CONSTANTS.maxTagLength) {
      return {
        isValid: false,
        error: `Each tag must be less than ${UI_CONSTANTS.maxTagLength} characters`
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
}

/**
 * Validate URL format
 * @param {string} url - URL string
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch (e) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}
