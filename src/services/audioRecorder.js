// Audio Recorder Service

import { AUDIO_CONFIG } from '../utils/constants.js';

class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.onChunk = null;
    this.onStateChange = null;
  }

  /**
   * Initialize audio recorder with microphone access
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: AUDIO_CONFIG.echoCancellation,
          noiseSuppression: AUDIO_CONFIG.noiseSuppression,
          autoGainControl: AUDIO_CONFIG.autoGainControl,
          sampleRate: AUDIO_CONFIG.sampleRate,
          channelCount: AUDIO_CONFIG.channelCount,
        }
      });

      // Check if mimeType is supported
      const mimeType = MediaRecorder.isTypeSupported(AUDIO_CONFIG.mimeType)
        ? AUDIO_CONFIG.mimeType
        : 'audio/webm';

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: mimeType
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          if (this.onChunk) {
            this.onChunk(event.data);
          }
        }
      };

      this.mediaRecorder.onstart = () => {
        if (this.onStateChange) {
          this.onStateChange('recording');
        }
      };

      this.mediaRecorder.onpause = () => {
        if (this.onStateChange) {
          this.onStateChange('paused');
        }
      };

      this.mediaRecorder.onresume = () => {
        if (this.onStateChange) {
          this.onStateChange('recording');
        }
      };

      this.mediaRecorder.onstop = () => {
        if (this.onStateChange) {
          this.onStateChange('stopped');
        }
      };

    } catch (error) {
      console.error('Error initializing audio recorder:', error);
      throw error;
    }
  }

  /**
   * Start recording
   * @returns {void}
   */
  start() {
    if (!this.mediaRecorder) {
      throw new Error('MediaRecorder not initialized');
    }
    
    this.audioChunks = [];
    this.mediaRecorder.start(AUDIO_CONFIG.chunkInterval);
  }

  /**
   * Pause recording
   * @returns {void}
   */
  pause() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  /**
   * Resume recording
   * @returns {void}
   */
  resume() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  /**
   * Stop recording and return audio blob
   * @returns {Promise<Blob>} Audio blob
   */
  stop() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { 
          type: this.mediaRecorder.mimeType 
        });
        resolve(audioBlob);
        
        // Cleanup
        this.cleanup();
      };

      this.mediaRecorder.onerror = (error) => {
        reject(error);
        this.cleanup();
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      } else {
        const audioBlob = new Blob(this.audioChunks, { 
          type: 'audio/webm' 
        });
        resolve(audioBlob);
        this.cleanup();
      }
    });
  }

  /**
   * Get current recording state
   * @returns {string} Current state
   */
  getState() {
    return this.mediaRecorder ? this.mediaRecorder.state : 'inactive';
  }

  /**
   * Get audio stream for visualization
   * @returns {MediaStream} Audio stream
   */
  getStream() {
    return this.stream;
  }

  /**
   * Cleanup resources
   * @returns {void}
   */
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

// Create singleton instance
const audioRecorder = new AudioRecorder();

export default audioRecorder;
