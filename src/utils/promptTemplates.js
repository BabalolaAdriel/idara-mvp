// Prompt Templates for Gemini API

/**
 * Generate structured notes from lecture transcript
 * @param {string} transcript - Lecture transcript
 * @param {Object} metadata - Lecture metadata
 * @returns {string} Formatted prompt
 */
export function generateNotesPrompt(transcript, metadata = {}) {
  return `You are an expert educational assistant helping students study from lecture transcripts. Analyze the following lecture transcript and generate comprehensive, structured study notes.

TRANSCRIPT:
${transcript}

METADATA:
- Title: ${metadata.title || 'Untitled Lecture'}
- Date: ${metadata.date || 'Unknown'}
- Duration: ${metadata.duration || 'Unknown'}

Generate structured notes with the following sections:

1. 📋 EXECUTIVE SUMMARY
Write a concise 2-3 sentence summary of the main topic and purpose of this lecture.

2. 🎯 KEY CONCEPTS
List 1-10 key concepts covered in this lecture. For each concept:
- Provide the concept title
- Include a brief explanation (2-3 sentences)
- Add a relevant example if applicable

3. 📐 FORMULAS & EQUATIONS
If the lecture contains mathematical formulas, equations, or scientific notation:
- List each formula with its name
- Provide the formula in standard notation
- Add a brief description of what each variable represents
(If no formulas are present, write "No formulas covered in this lecture")

4. 📖 DEFINITIONS & TERMINOLOGY
List important terms and definitions in alphabetical order:
- Term: Definition
Include 5-15 key terms depending on lecture content.

5. ❓ PRACTICE QUESTIONS
Generate 10 practice questions across three difficulty levels:
- 3 Basic questions (test fundamental understanding)
- 4 Intermediate questions (test application of concepts)
- 3 Advanced questions (test critical thinking and synthesis)

For each question, indicate the difficulty level.

6. ⚡ QUICK REVIEW POINTS
Create 5-7 bullet points summarizing the most important takeaways for quick revision.

7. 💡 STUDY TIPS
Provide 2-3 specific study recommendations based on this lecture content:
- How to best review this material
- Connections to make with other topics
- Practical application suggestions

FORMAT INSTRUCTIONS:
- Use clear markdown formatting
- Use bullet points, numbered lists, and headers appropriately
- Be concise but comprehensive
- Focus on educational value and exam preparation
- Maintain academic tone

Generate the notes now:`;
}

/**
 * Generate Veo prompt for video animation
 * @param {string} concept - Concept to visualize
 * @param {Object} options - Video options
 * @returns {string} Veo prompt
 */
export function generateVeoPrompt(concept, options = {}) {
  const { style = 'educational', duration = 30 } = options;
  
  const styleDescriptions = {
    educational: 'Clean educational whiteboard animation style with hand-drawn illustrations, vibrant colors, and smooth transitions. Professional yet engaging.',
    '3d': 'Stunning 3D animation with realistic rendering, dynamic camera movements, and cinematic lighting. Professional educational production quality.',
    infographic: 'Modern flat design infographic style with bold colors, geometric shapes, icons, and animated data visualizations. Clean and professional.'
  };
  
  return `You are an expert at creating video prompts for educational content. Based on the following concept, create a detailed, specific video prompt for Veo 3 that will generate a ${duration}-second educational animation.

CONCEPT TO VISUALIZE:
${concept}

STYLE: ${styleDescriptions[style] || styleDescriptions.educational}

Create a prompt that includes:
1. Opening scene description
2. Main visual elements and their animations
3. Text overlays or labels to include
4. Color scheme and visual style
5. Transitions and camera movements
6. Closing scene

The video should be educational, engaging, and visually clear. Focus on helping students understand the concept through visual storytelling.

Generate the video prompt now (200-300 words):`;
}

/**
 * Extract visual concepts from generated notes
 * @param {Object} notes - Structured notes object
 * @returns {string} Prompt for concept extraction
 */
export function extractConceptsPrompt(notes) {
  return `Analyze the following lecture notes and identify the top 3-5 concepts that would benefit most from visual animation.

NOTES:
${JSON.stringify(notes, null, 2)}

For each concept:
1. Choose concepts that are:
   - Visual in nature (can be illustrated/animated)
   - Complex enough to benefit from visualization
   - Core to understanding the lecture topic

2. Provide:
   - Concept title (concise, 3-8 words)
   - Brief description (1-2 sentences)
   - Why it's good for visualization (1 sentence)

Return ONLY a JSON array in this format:
[
  {
    "title": "Concept Title",
    "description": "Brief description of the concept",
    "reason": "Why this concept benefits from visualization"
  }
]

Extract concepts now:`;
}

/**
 * Improve transcript quality with context
 * @param {string} transcript - Raw transcript
 * @returns {string} Improvement prompt
 */
export function improveTranscriptPrompt(transcript) {
  return `You are helping improve an automatically transcribed lecture. Fix any obvious transcription errors, add proper punctuation, and improve readability while maintaining the original meaning and content.

ORIGINAL TRANSCRIPT:
${transcript}

Guidelines:
- Fix common transcription errors (homophones, missing punctuation, etc.)
- Add proper sentence breaks and paragraphs
- Maintain all original content and meaning
- Do not add or remove information
- Keep the conversational lecture tone
- Format for readability

Return the improved transcript:`;
}
