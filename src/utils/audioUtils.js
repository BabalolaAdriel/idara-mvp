// Audio Utility Functions

/**
 * Convert audio blob to WAV format for Whisper
 * @param {Blob} audioBlob - Input audio blob
 * @returns {Promise<Blob>} WAV formatted blob
 */
export async function convertToWav(audioBlob) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const wavBuffer = encodeWAV(audioBuffer);
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

/**
 * Encode AudioBuffer to WAV format
 * @param {AudioBuffer} audioBuffer
 * @returns {ArrayBuffer}
 */
function encodeWAV(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const data = audioBuffer.getChannelData(0);
  const dataLength = data.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write audio data
  floatTo16BitPCM(view, 44, data);

  return buffer;
}

/**
 * Write string to DataView
 */
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Convert float samples to 16-bit PCM
 */
function floatTo16BitPCM(view, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

/**
 * Get duration of audio blob
 * @param {Blob} blob - Audio blob
 * @returns {Promise<number>} Duration in seconds
 */
export async function getAudioDuration(blob) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
    audio.addEventListener('error', reject);
    audio.src = URL.createObjectURL(blob);
  });
}

/**
 * Create object URL for audio blob
 * @param {Blob} blob - Audio blob
 * @returns {string} Object URL
 */
export function createAudioUrl(blob) {
  return URL.createObjectURL(blob);
}

/**
 * Revoke object URL to free memory
 * @param {string} url - Object URL to revoke
 */
export function revokeAudioUrl(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Download audio blob as file
 * @param {Blob} blob - Audio blob
 * @param {string} filename - Desired filename
 */
export function downloadAudio(blob, filename = 'recording.webm') {
  const url = createAudioUrl(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  revokeAudioUrl(url);
}
