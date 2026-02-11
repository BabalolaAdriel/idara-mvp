// AudioRecorder Component

import { useState, useEffect } from 'react';
import { Mic, Square, Pause, Play, Wifi, WifiOff } from 'lucide-react';
import { formatDuration } from '../utils/formatters.js';
import WaveformVisualizer from './WaveformVisualizer.jsx';
import TranscriptViewer from './TranscriptViewer.jsx';
import useAudioRecorder from '../hooks/useAudioRecorder.js';
import useTranscription from '../hooks/useTranscription.js';
import useNetworkStatus from '../hooks/useNetworkStatus.js';

export default function AudioRecorder({ onRecordingComplete }) {
  const { isOnline } = useNetworkStatus();
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    stream,
    error: recordError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useAudioRecorder();

  const {
    transcript,
    isTranscribing,
    transcribe,
  } = useTranscription();

  const [state, setState] = useState('idle'); // idle, recording, paused, saving

  useEffect(() => {
    if (isRecording && !isPaused) {
      setState('recording');
    } else if (isPaused) {
      setState('paused');
    } else {
      setState('idle');
    }
  }, [isRecording, isPaused]);

  const handleStart = async () => {
    try {
      await startRecording();
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const handleStop = async () => {
    try {
      setState('saving');
      const blob = await stopRecording();
      
      if (blob && onRecordingComplete) {
        onRecordingComplete({
          audioBlob: blob,
          duration,
          transcript,
        });
      }
      
      setState('idle');
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setState('idle');
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Status Banner */}
      <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
        isOnline ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <span className="text-sm font-medium">
              Connected - Live transcription available
            </span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">
              Offline - Recording only (transcription will be processed later)
            </span>
          </>
        )}
      </div>

      {/* Error Message */}
      {recordError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{recordError}</p>
        </div>
      )}

      {/* Recording Controls */}
      <div className="card text-center space-y-6">
        {/* Timer */}
        <div className="text-6xl font-bold text-gray-900 font-mono">
          {formatDuration(duration)}
        </div>

        {/* Status */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            state === 'recording' ? 'bg-red-500 animate-pulse' :
            state === 'paused' ? 'bg-yellow-500' :
            'bg-gray-300'
          }`} />
          <span className="text-sm font-medium text-gray-600">
            {state === 'recording' && 'Recording...'}
            {state === 'paused' && 'Paused'}
            {state === 'saving' && 'Saving...'}
            {state === 'idle' && 'Ready to record'}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={handleStart}
              className="w-20 h-20 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
              disabled={state === 'saving'}
            >
              <Mic className="w-10 h-10" />
            </button>
          ) : (
            <>
              <button
                onClick={handlePauseResume}
                className="w-16 h-16 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transition-all"
              >
                {isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
              </button>
              
              <button
                onClick={handleStop}
                className="w-20 h-20 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <Square className="w-10 h-10" />
              </button>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500">
          {!isRecording
            ? 'Click the microphone button to start recording'
            : 'Click pause to temporarily stop, or stop to end recording'
          }
        </p>
      </div>

      {/* Waveform Visualization */}
      {stream && (
        <WaveformVisualizer 
          stream={stream} 
          isActive={isRecording && !isPaused} 
        />
      )}

      {/* Live Transcript */}
      {isRecording && (
        <TranscriptViewer 
          transcript={transcript} 
          autoScroll={true}
        />
      )}
    </div>
  );
}
