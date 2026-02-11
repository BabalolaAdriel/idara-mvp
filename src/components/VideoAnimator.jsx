// VideoAnimator Component

import { useState } from 'react';
import { Video, Download, Loader, Play, CheckCircle } from 'lucide-react';
import { generateVideo, getVideoStatus } from '../services/veoService.js';
import { VIDEO_CONFIG } from '../utils/constants.js';
import ConceptSelector from './ConceptSelector.jsx';

export default function VideoAnimator({ concepts = [], lectureTitle }) {
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [style, setStyle] = useState('educational');
  const [duration, setDuration] = useState(30);
  const [queue, setQueue] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (selectedConcepts.length === 0) {
      alert('Please select at least one concept');
      return;
    }

    setIsGenerating(true);

    const newJobs = [];
    
    for (const conceptTitle of selectedConcepts) {
      const concept = concepts.find(c => c.title === conceptTitle);
      
      try {
        const job = await generateVideo(concept.description, { style, duration });
        newJobs.push({
          ...job,
          title: conceptTitle,
          status: 'pending',
        });
      } catch (err) {
        console.error('Error generating video:', err);
        newJobs.push({
          title: conceptTitle,
          status: 'error',
          error: err.message,
        });
      }
    }

    setQueue(newJobs);
    setIsGenerating(false);

    // Poll for completion
    pollVideos(newJobs);
  };

  const pollVideos = async (jobs) => {
    const updatedJobs = [];
    
    for (const job of jobs) {
      if (job.status === 'pending') {
        try {
          const result = await getVideoStatus(job.jobId);
          updatedJobs.push({
            ...job,
            ...result,
          });
        } catch (err) {
          updatedJobs.push({
            ...job,
            status: 'error',
            error: err.message,
          });
        }
      } else {
        updatedJobs.push(job);
      }
    }

    setQueue(updatedJobs);
  };

  const handleDownload = async (job) => {
    if (!job.videoUrl) return;
    
    const a = document.createElement('a');
    a.href = job.videoUrl;
    a.download = `${job.title}-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Video className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Video Animation</h2>
            <p className="text-gray-600">Generate educational videos with Veo 3</p>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Animation Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="input"
            >
              {VIDEO_CONFIG.styles.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <div className="flex space-x-2">
              {VIDEO_CONFIG.durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${duration === d
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Concept Selection */}
      <ConceptSelector
        concepts={concepts}
        onSelectionChange={setSelectedConcepts}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || selectedConcepts.length === 0}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Generating Videos...</span>
          </>
        ) : (
          <>
            <Video className="w-5 h-5" />
            <span>Generate {selectedConcepts.length} Video{selectedConcepts.length !== 1 ? 's' : ''}</span>
          </>
        )}
      </button>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Generation Queue</h3>
          
          {queue.map((job, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{job.title}</h4>
                  
                  <div className="flex items-center space-x-2">
                    {job.status === 'pending' && (
                      <>
                        <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-sm text-blue-600">Processing...</span>
                      </>
                    )}
                    
                    {job.status === 'completed' && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">Complete</span>
                      </>
                    )}
                    
                    {job.status === 'error' && (
                      <span className="text-sm text-red-600">Error: {job.error}</span>
                    )}
                  </div>
                </div>

                {job.status === 'completed' && (
                  <div className="flex items-center space-x-2">
                    <a
                      href={job.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Preview</span>
                    </a>
                    
                    <button
                      onClick={() => handleDownload(job)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
