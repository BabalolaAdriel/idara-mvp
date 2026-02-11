// RecordPage Component

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder.jsx';
import useStorage from '../hooks/useStorage.js';
import useTranscription from '../hooks/useTranscription.js';
import { generateId } from '../utils/formatters.js';

export default function RecordPage() {
  const navigate = useNavigate();
  const { saveLecture } = useStorage();
  const { transcribe, loadModel, isModelLoaded } = useTranscription();
  
  const [lectureTitle, setLectureTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load Whisper model on mount
  useState(() => {
    loadModel().catch(console.error);
  }, []);

  const handleRecordingComplete = async (recordingData) => {
    try {
      setIsSaving(true);
      setError(null);

      // Generate title if not provided
      const title = lectureTitle.trim() || 
        `Lecture ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

      // Transcribe audio if not already done
      let transcript = recordingData.transcript;
      if (!transcript && recordingData.audioBlob) {
        try {
          const result = await transcribe(recordingData.audioBlob);
          transcript = result?.text || '';
        } catch (err) {
          console.warn('Transcription failed, saving without transcript:', err);
        }
      }

      // Save lecture
      const lecture = {
        id: generateId(),
        title,
        date: Date.now(),
        duration: recordingData.duration,
        audioBlob: recordingData.audioBlob,
        transcript: transcript || '',
        notes: null,
        videoUrl: null,
        isProcessed: false,
        tags: [],
      };

      const id = await saveLecture(lecture);
      
      // Navigate to lecture detail page
      navigate(`/lecture/${id}`);
    } catch (err) {
      console.error('Error saving lecture:', err);
      setError(err.message || 'Failed to save lecture');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Record Lecture
        </h1>
        <p className="text-gray-600 mb-6">
          Record your lecture and get automatic transcription. You can generate study notes 
          and video animations after recording.
        </p>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lecture Title (optional)
          </label>
          <input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="e.g., Introduction to Machine Learning"
            className="input"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to auto-generate from date and time
          </p>
        </div>
      </div>

      {/* Model Status */}
      {!isModelLoaded && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">
              Transcription Model Not Loaded
            </h3>
            <p className="text-sm text-yellow-800">
              The offline transcription model is not available. You can still record audio, 
              but transcription will be simulated. To enable real transcription, download 
              the Whisper model and place it in the public/models/ directory.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Saving Indicator */}
      {isSaving && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
          <Save className="w-5 h-5 text-blue-600 animate-pulse" />
          <p className="text-blue-800">Saving lecture...</p>
        </div>
      )}

      {/* Audio Recorder */}
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">💡 Recording Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Find a quiet environment to minimize background noise</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Position yourself close to the microphone for better audio quality</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Use the pause button for breaks instead of stopping the recording</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Your recording is auto-saved every 30 seconds for safety</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Offline mode works great - notes can be generated later when online</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
