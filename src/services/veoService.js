// Veo API Service for Video Generation

import { API_ENDPOINTS, ERROR_MESSAGES } from '../utils/constants.js';
import { validateApiKey } from '../utils/validators.js';
import { generateVeoPrompt } from './geminiService.js';

/**
 * Generate video from concept
 * @param {string} concept - Concept to visualize
 * @param {Object} options - Video options (style, duration)
 * @returns {Promise<Object>} Video generation result
 */
export async function generateVideo(concept, options = {}) {
  const { style = 'educational', duration = 30 } = options;

  try {
    // Step 1: Generate Veo prompt using Gemini
    const videoPrompt = await generateVeoPrompt(concept, { style, duration });

    // Step 2: Call Veo API
    const apiKey = import.meta.env.VITE_VEO_API_KEY;
    
    const validation = validateApiKey(apiKey);
    if (!validation.isValid) {
      throw new Error(ERROR_MESSAGES.apiKeyMissing);
    }

    const requestBody = {
      contents: [{
        parts: [{
          text: videoPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(`${API_ENDPOINTS.veo}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Veo API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // In a real implementation, Veo would return a video generation job ID
    // We would then poll for completion
    // For MVP, we'll simulate this
    
    return {
      jobId: `veo_${Date.now()}`,
      status: 'pending',
      concept,
      style,
      duration,
      prompt: videoPrompt,
      estimatedCompletion: Date.now() + (duration * 2000), // Estimate 2s per second of video
    };

  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}

/**
 * Poll for video generation status
 * @param {string} jobId - Video generation job ID
 * @returns {Promise<Object>} Job status
 */
export async function getVideoStatus(jobId) {
  // In a real implementation, this would poll the Veo API
  // For MVP, we'll simulate completion after a delay
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    jobId,
    status: 'completed',
    videoUrl: `https://example.com/videos/${jobId}.mp4`,
    thumbnailUrl: `https://example.com/videos/${jobId}_thumb.jpg`,
    duration: 30,
  };
}

/**
 * Extract visual concepts from notes
 * @param {Object} notes - Structured notes
 * @returns {Array} Top 3-5 visual concepts
 */
export function extractVisualConcepts(notes) {
  const concepts = [];

  // Extract from key concepts
  if (notes.structured && notes.structured.concepts) {
    const conceptText = notes.structured.concepts;
    const lines = conceptText.split('\n').filter(line => line.trim());
    
    for (const line of lines.slice(0, 5)) {
      if (line.match(/^[-*•]/) || line.match(/^\d+\./)) {
        const cleaned = line.replace(/^[-*•\d.]\s*/, '').trim();
        if (cleaned.length > 10) {
          concepts.push({
            title: cleaned.substring(0, 100),
            description: cleaned,
            selected: concepts.length < 3, // Auto-select first 3
          });
        }
      }
    }
  }

  // Extract from formulas if present
  if (notes.structured && notes.structured.formulas) {
    const formulaText = notes.structured.formulas;
    if (!formulaText.includes('No formulas')) {
      concepts.push({
        title: 'Mathematical Formulas Visualization',
        description: 'Visual representation of key formulas and equations',
        selected: false,
      });
    }
  }

  return concepts.slice(0, 5);
}

/**
 * Download video
 * @param {string} videoUrl - Video URL
 * @param {string} filename - Desired filename
 * @returns {Promise<void>}
 */
export async function downloadVideo(videoUrl, filename = 'video.mp4') {
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading video:', error);
    throw error;
  }
}

/**
 * Concatenate multiple videos
 * @param {Array<string>} videoUrls - Array of video URLs
 * @returns {Promise<string>} Concatenated video URL
 */
export async function concatenateVideos(videoUrls) {
  // In a real implementation, this would use a video processing service
  // For MVP, we'll just return the first video URL
  console.warn('Video concatenation not implemented in MVP');
  return videoUrls[0];
}

export default {
  generateVideo,
  getVideoStatus,
  extractVisualConcepts,
  downloadVideo,
  concatenateVideos,
};
