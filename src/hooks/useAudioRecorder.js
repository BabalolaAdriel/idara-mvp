// useAudioRecorder Hook

import { useState, useEffect, useCallback } from 'react';
import audioRecorder from '../services/audioRecorder.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  // Duration timer
  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Initialize and start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      await audioRecorder.initialize();
      
      audioRecorder.onStateChange = (state) => {
        setIsRecording(state === 'recording');
        setIsPaused(state === 'paused');
      };

      audioRecorder.start();
      setStream(audioRecorder.getStream());
      setDuration(0);
    } catch (err) {
      console.error('Error starting recording:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError(ERROR_MESSAGES.microphonePermission);
      } else {
        setError(err.message || 'Failed to start recording');
      }
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(async () => {
    try {
      const blob = await audioRecorder.stop();
      setAudioBlob(blob);
      setIsRecording(false);
      setIsPaused(false);
      setStream(null);
      return blob;
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError(err.message || 'Failed to stop recording');
      return null;
    }
  }, []);

  // Pause recording
  const pauseRecording = useCallback(() => {
    try {
      audioRecorder.pause();
    } catch (err) {
      console.error('Error pausing recording:', err);
      setError(err.message || 'Failed to pause recording');
    }
  }, []);

  // Resume recording
  const resumeRecording = useCallback(() => {
    try {
      audioRecorder.resume();
    } catch (err) {
      console.error('Error resuming recording:', err);
      setError(err.message || 'Failed to resume recording');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        audioRecorder.stop().catch(console.error);
      }
      audioRecorder.cleanup();
    };
  }, []);

  return {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    stream,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
}
