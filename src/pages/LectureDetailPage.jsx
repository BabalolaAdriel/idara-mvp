// LectureDetailPage Component

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause,
  FileText, 
  Video,
  Calendar,
  Clock,
  Edit2,
  Save,
  X,
  Tag
} from 'lucide-react';
import { formatDuration, formatDate } from '../utils/formatters.js';
import useStorage from '../hooks/useStorage.js';
import TranscriptViewer from '../components/TranscriptViewer.jsx';
import NoteGenerator from '../components/NoteGenerator.jsx';
import VideoAnimator from '../components/VideoAnimator.jsx';
import { extractVisualConcepts } from '../services/veoService.js';

export default function LectureDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadLecture, updateLecture } = useStorage();
  
  const [lecture, setLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState('');
  const [activeTab, setActiveTab] = useState('transcript'); // transcript, notes, video
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [videoConcepts, setVideoConcepts] = useState([]);

  // Load lecture
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await loadLecture(Number(id));
        
        if (!data) {
          setError('Lecture not found');
          return;
        }
        
        setLecture(data);
        setEditTitle(data.title);
        setEditTags(data.tags?.join(', ') || '');
        
        // Create audio URL
        if (data.audioBlob) {
          const url = URL.createObjectURL(data.audioBlob);
          setAudioUrl(url);
        }
        
        // Extract video concepts if notes exist
        if (data.notes) {
          const concepts = extractVisualConcepts(data.notes);
          setVideoConcepts(concepts);
        }
      } catch (err) {
        console.error('Error loading lecture:', err);
        setError(err.message || 'Failed to load lecture');
      } finally {
        setIsLoading(false);
      }
    };

    load();

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [id]);

  const handleSaveEdit = async () => {
    try {
      const tags = editTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await updateLecture(Number(id), {
        title: editTitle,
        tags,
      });

      setLecture({ ...lecture, title: editTitle, tags });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating lecture:', err);
    }
  };

  const handleNotesGenerated = async (notes) => {
    await updateLecture(Number(id), {
      notes,
      isProcessed: true,
    });
    
    setLecture({ ...lecture, notes, isProcessed: true });
    
    // Extract video concepts
    const concepts = extractVisualConcepts(notes);
    setVideoConcepts(concepts);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'Lecture not found'}
        </h2>
        <Link to="/library" className="btn-primary mt-4">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/library" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </Link>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input text-xl font-bold"
                  placeholder="Lecture title"
                />
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="input"
                  placeholder="Tags (comma separated)"
                />
                <div className="flex space-x-2">
                  <button onClick={handleSaveEdit} className="btn-primary flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {lecture.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(lecture.date, true)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(lecture.duration)}
                  </div>
                  {lecture.isProcessed && (
                    <span className="badge-success">Processed</span>
                  )}
                </div>
                
                {lecture.tags && lecture.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {lecture.tags.map((tag, i) => (
                      <span key={i} className="badge bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-gray-50 rounded-lg p-4">
            <audio
              src={audioUrl}
              controls
              className="w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="card p-0">
        <div className="flex border-b border-gray-200">
          <TabButton
            active={activeTab === 'transcript'}
            onClick={() => setActiveTab('transcript')}
            icon={FileText}
            label="Transcript"
          />
          <TabButton
            active={activeTab === 'notes'}
            onClick={() => setActiveTab('notes')}
            icon={FileText}
            label="Study Notes"
          />
          <TabButton
            active={activeTab === 'video'}
            onClick={() => setActiveTab('video')}
            icon={Video}
            label="Video Animation"
            disabled={!lecture.notes}
          />
        </div>

        <div className="p-6">
          {activeTab === 'transcript' && (
            <TranscriptViewer transcript={lecture.transcript} autoScroll={false} />
          )}

          {activeTab === 'notes' && (
            <NoteGenerator
              transcript={lecture.transcript}
              metadata={{
                title: lecture.title,
                date: formatDate(lecture.date),
                duration: formatDuration(lecture.duration),
              }}
              onNotesGenerated={handleNotesGenerated}
            />
          )}

          {activeTab === 'video' && lecture.notes && (
            <VideoAnimator
              concepts={videoConcepts}
              lectureTitle={lecture.title}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors
        ${active
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
