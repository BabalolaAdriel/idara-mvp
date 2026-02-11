// SettingsPage Component

import { useState, useEffect } from 'react';
import { 
  Key, 
  Database, 
  Trash2, 
  Info,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import useStore from '../store/useStore.js';
import useStorage from '../hooks/useStorage.js';
import { formatFileSize } from '../utils/formatters.js';
import { validateApiKey } from '../utils/validators.js';
import { APP_CONFIG } from '../utils/constants.js';

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const { stats, clearAll } = useStorage();
  
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [veoApiKey, setVeoApiKey] = useState('');
  const [autoSave, setAutoSave] = useState(settings.autoSave);
  const [transcriptionQuality, setTranscriptionQuality] = useState(settings.transcriptionQuality);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setGeminiApiKey(import.meta.env.VITE_GEMINI_API_KEY || '');
    setVeoApiKey(import.meta.env.VITE_VEO_API_KEY || '');
  }, []);

  const handleSaveSettings = () => {
    updateSettings({
      autoSave,
      transcriptionQuality,
    });
    
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleClearData = async () => {
    if (showClearConfirm) {
      await clearAll();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 5000);
    }
  };

  const geminiValidation = validateApiKey(geminiApiKey);
  const veoValidation = validateApiKey(veoApiKey);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your Idara experience
        </p>
      </div>

      {/* API Configuration */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
            <p className="text-sm text-gray-600">Configure your Google AI API keys</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Gemini API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="input"
              readOnly
            />
            {geminiApiKey && !geminiValidation.isValid && (
              <p className="text-sm text-red-600 mt-1">
                {geminiValidation.error}
              </p>
            )}
            {geminiApiKey && geminiValidation.isValid && (
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                API key configured
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Required for generating study notes from transcripts
            </p>
          </div>

          {/* Veo API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Veo API Key
            </label>
            <input
              type="password"
              value={veoApiKey}
              onChange={(e) => setVeoApiKey(e.target.value)}
              placeholder="Enter your Veo API key"
              className="input"
              readOnly
            />
            {veoApiKey && !veoValidation.isValid && (
              <p className="text-sm text-red-600 mt-1">
                {veoValidation.error}
              </p>
            )}
            {veoApiKey && veoValidation.isValid && (
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                API key configured
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Required for generating video animations
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How to get API keys:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Visit <a href="https://makersuite.google.com/app/apikey" className="underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                <li>Create or select a project</li>
                <li>Generate API keys for Gemini and Veo</li>
                <li>Add them to your .env file as VITE_GEMINI_API_KEY and VITE_VEO_API_KEY</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Recording Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recording Settings</h2>
        
        <div className="space-y-6">
          {/* Auto-save */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Auto-save</h3>
              <p className="text-sm text-gray-600">
                Automatically save recordings every 30 seconds
              </p>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${autoSave ? 'bg-primary-600' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${autoSave ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {/* Transcription Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transcription Quality
            </label>
            <select
              value={transcriptionQuality}
              onChange={(e) => setTranscriptionQuality(e.target.value)}
              className="input"
            >
              <option value="standard">Standard (Faster, 39MB model)</option>
              <option value="high">High (Slower, 74MB model)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Higher quality provides better accuracy but requires more processing time
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center space-x-3">
            <button onClick={handleSaveSettings} className="btn-primary flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </button>
            
            {saveStatus === 'success' && (
              <span className="text-green-600 text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Settings saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Storage Management */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Storage</h2>
            <p className="text-sm text-gray-600">Manage your local data</p>
          </div>
        </div>

        {stats && (
          <div className="space-y-4">
            {/* Storage Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Lectures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(stats.totalSize)}
                </p>
              </div>
            </div>

            {/* Clear Data */}
            <div className="border-t pt-4">
              <button
                onClick={handleClearData}
                className={`
                  btn w-full flex items-center justify-center
                  ${showClearConfirm
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }
                `}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {showClearConfirm ? 'Click again to confirm deletion' : 'Clear All Data'}
              </button>
              
              {!showClearConfirm && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This will permanently delete all lectures and cannot be undone
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="card bg-gradient-to-br from-primary-50 to-indigo-50">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">I</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              About {APP_CONFIG.name}
            </h2>
            <p className="text-gray-700 mb-3">
              {APP_CONFIG.description}
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Version: {APP_CONFIG.version}</p>
              <p>Built for: Gemini Day Hackathon</p>
              <p className="mt-3 text-xs text-gray-500">
                Made with React 18, Vite, Tailwind CSS, Zustand, Dexie.js, 
                Gemini 1.5 Flash API, and Veo 3 API
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
