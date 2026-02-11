// useTranscription Hook

import { useState, useCallback } from 'react';
import { 
  initWhisper, 
  transcribeAudio, 
  isWhisperModelLoaded,
  getModelInfo 
} from '../services/whisperService.js';
import { validateAudioBlob } from '../utils/validators.js';

export default function useTranscription() {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);

  // Load Whisper model
  const loadModel = useCallback(async () => {
    try {
      setError(null);
      await initWhisper();
      setIsModelLoaded(isWhisperModelLoaded());
      return true;
    } catch (err) {
      console.error('Error loading Whisper model:', err);
      setError(err.message || 'Failed to load transcription model');
      return false;
    }
  }, []);

  // Transcribe audio blob
  const transcribe = useCallback(async (audioBlob) => {
    const validation = validateAudioBlob(audioBlob);
    if (!validation.isValid) {
      setError(validation.error);
      return null;
    }

    try {
      setError(null);
      setIsTranscribing(true);
      setProgress(0);
      setTranscript('');

      const result = await transcribeAudio(audioBlob, (prog) => {
        setProgress(prog);
      });

      setTranscript(result.text);
      setConfidence(result.confidence);
      setProgress(100);
      
      return result;
    } catch (err) {
      console.error('Error transcribing audio:', err);
      setError(err.message || 'Failed to transcribe audio');
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setProgress(0);
    setError(null);
  }, []);

  // Get model info
  const modelInfo = getModelInfo();

  return {
    transcript,
    isTranscribing,
    isModelLoaded,
    progress,
    confidence,
    error,
    modelInfo,
    loadModel,
    transcribe,
    clearTranscript,
  };
}
