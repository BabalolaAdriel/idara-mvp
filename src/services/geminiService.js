// Gemini API Service

import { API_ENDPOINTS, GEMINI_CONFIG, RATE_LIMIT_CONFIG, ERROR_MESSAGES } from '../utils/constants.js';
import { generateNotesPrompt, extractConceptsPrompt } from '../utils/promptTemplates.js';
import { validateTranscript, validateApiKey } from '../utils/validators.js';

/**
 * Call Gemini API with retry logic
 * @param {string} prompt - Prompt text
 * @param {Object} config - Configuration options
 * @returns {Promise<string>} Generated text
 */
async function callGeminiAPI(prompt, config = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  const validation = validateApiKey(apiKey);
  if (!validation.isValid) {
    throw new Error(ERROR_MESSAGES.apiKeyMissing);
  }

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: config.temperature || GEMINI_CONFIG.temperature,
      topK: config.topK || GEMINI_CONFIG.topK,
      topP: config.topP || GEMINI_CONFIG.topP,
      maxOutputTokens: config.maxOutputTokens || GEMINI_CONFIG.maxOutputTokens,
    }
  };

  let retries = 0;
  let delay = RATE_LIMIT_CONFIG.initialDelay;

  while (retries <= RATE_LIMIT_CONFIG.maxRetries) {
    try {
      const response = await fetch(`${API_ENDPOINTS.gemini}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 429) {
        // Rate limited - exponential backoff
        if (retries < RATE_LIMIT_CONFIG.maxRetries) {
          console.warn(`Rate limited. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay = Math.min(delay * RATE_LIMIT_CONFIG.backoffMultiplier, RATE_LIMIT_CONFIG.maxDelay);
          retries++;
          continue;
        } else {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }

      if (response.status === 400) {
        const error = await response.json();
        throw new Error(`Invalid request: ${error.error?.message || 'Bad request'}`);
      }

      if (response.status === 500) {
        // Server error - retry with delay
        if (retries < RATE_LIMIT_CONFIG.maxRetries) {
          console.warn(`Server error. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
          continue;
        } else {
          throw new Error('Server error. Please try again later.');
        }
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      const text = data.candidates[0].content.parts[0].text;
      return text;

    } catch (error) {
      if (retries >= RATE_LIMIT_CONFIG.maxRetries) {
        throw error;
      }
      
      // Network error - retry
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        console.warn(`Network error. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * RATE_LIMIT_CONFIG.backoffMultiplier, RATE_LIMIT_CONFIG.maxDelay);
        retries++;
        continue;
      }
      
      throw error;
    }
  }
}

/**
 * Generate structured notes from transcript
 * @param {string} transcript - Lecture transcript
 * @param {Object} metadata - Lecture metadata
 * @returns {Promise<Object>} Structured notes
 */
export async function generateNotes(transcript, metadata = {}) {
  const validation = validateTranscript(transcript);
  if (!validation.isValid) {
    throw new Error(validation.error || ERROR_MESSAGES.invalidTranscript);
  }

  try {
    const prompt = generateNotesPrompt(transcript, metadata);
    const response = await callGeminiAPI(prompt);

    // Parse the response into structured format
    const structuredNotes = parseNotesResponse(response);

    return {
      raw: response,
      structured: structuredNotes,
      metadata: {
        generatedAt: Date.now(),
        model: 'gemini-1.5-flash',
        tokenCount: Math.ceil(response.length / 4), // Approximate
      }
    };
  } catch (error) {
    console.error('Error generating notes:', error);
    throw error;
  }
}

/**
 * Parse Gemini response into structured notes
 * @param {string} response - Raw response text
 * @returns {Object} Structured notes object
 */
function parseNotesResponse(response) {
  // Basic parsing - in production, this would be more sophisticated
  const sections = {
    summary: extractSection(response, ['EXECUTIVE SUMMARY', '📋']),
    concepts: extractSection(response, ['KEY CONCEPTS', '🎯']),
    formulas: extractSection(response, ['FORMULAS & EQUATIONS', '📐', 'FORMULAS']),
    definitions: extractSection(response, ['DEFINITIONS & TERMINOLOGY', '📖', 'DEFINITIONS']),
    questions: extractSection(response, ['PRACTICE QUESTIONS', '❓']),
    reviewPoints: extractSection(response, ['QUICK REVIEW POINTS', '⚡']),
    studyTips: extractSection(response, ['STUDY TIPS', '💡']),
  };

  return sections;
}

/**
 * Extract section from response text
 * @param {string} text - Full response text
 * @param {Array<string>} markers - Section markers
 * @returns {string} Extracted section
 */
function extractSection(text, markers) {
  for (const marker of markers) {
    const regex = new RegExp(`${marker}[\\s\\S]*?(?=\\n#{1,2}|\\n[0-9]\\.|$)`, 'i');
    const match = text.match(regex);
    if (match) {
      return match[0].trim();
    }
  }
  return '';
}

/**
 * Extract visual concepts from notes
 * @param {Object} notes - Structured notes
 * @returns {Promise<Array>} Array of concepts
 */
export async function extractVisualConcepts(notes) {
  try {
    const prompt = extractConceptsPrompt(notes);
    const response = await callGeminiAPI(prompt);
    
    // Try to parse JSON response
    try {
      const concepts = JSON.parse(response);
      return Array.isArray(concepts) ? concepts : [];
    } catch (e) {
      // If JSON parsing fails, return empty array
      console.warn('Failed to parse concepts as JSON:', e);
      return [];
    }
  } catch (error) {
    console.error('Error extracting concepts:', error);
    return [];
  }
}

/**
 * Generate Veo video prompt
 * @param {string} concept - Concept to visualize
 * @param {Object} options - Video options
 * @returns {Promise<string>} Video prompt
 */
export async function generateVeoPrompt(concept, options = {}) {
  try {
    const { generateVeoPrompt: createPrompt } = await import('../utils/promptTemplates.js');
    const prompt = createPrompt(concept, options);
    const response = await callGeminiAPI(prompt);
    return response;
  } catch (error) {
    console.error('Error generating Veo prompt:', error);
    throw error;
  }
}

export default {
  generateNotes,
  extractVisualConcepts,
  generateVeoPrompt,
};
