// LectureList Component

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Circle,
  Trash2,
  Grid,
  List as ListIcon
} from 'lucide-react';
import { formatDuration, formatDate, truncateText } from '../utils/formatters.js';

export default function LectureList({ 
  lectures = [], 
  onDelete,
  viewMode: initialViewMode = 'grid' 
}) {
  const [viewMode, setViewMode] = useState(initialViewMode);

  if (lectures.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No lectures yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start recording your first lecture to build your study library
        </p>
        <Link to="/record" className="btn-primary">
          Record Lecture
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {lectures.length} Lecture{lectures.length !== 1 ? 's' : ''}
        </h2>
        
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`
              p-2 rounded transition-colors
              ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}
            `}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              p-2 rounded transition-colors
              ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}
            `}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lectures Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
      }>
        {lectures.map((lecture) => (
          <LectureCard
            key={lecture.id}
            lecture={lecture}
            viewMode={viewMode}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function LectureCard({ lecture, viewMode, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    if (showDeleteConfirm) {
      onDelete(lecture.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  if (viewMode === 'list') {
    return (
      <Link
        to={`/lecture/${lecture.id}`}
        className="card-hover flex items-center justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900">
              {truncateText(lecture.title, 60)}
            </h3>
            
            {lecture.isProcessed ? (
              <span className="badge-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                Processed
              </span>
            ) : (
              <span className="badge-warning">
                <Circle className="w-3 h-3 mr-1" />
                Unprocessed
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(lecture.date)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(lecture.duration)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className={`
            p-2 rounded-lg transition-colors
            ${showDeleteConfirm
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'hover:bg-gray-100 text-gray-600'
            }
          `}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Link>
    );
  }

  return (
    <Link
      to={`/lecture/${lecture.id}`}
      className="card-hover relative"
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {lecture.isProcessed ? (
          <span className="badge-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Processed
          </span>
        ) : (
          <span className="badge-warning">
            <Circle className="w-3 h-3 mr-1" />
            Unprocessed
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 pr-24">
          {truncateText(lecture.title, 50)}
        </h3>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(lecture.date)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(lecture.duration)}</span>
          </div>
        </div>

        {lecture.tags && lecture.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {lecture.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="badge bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className={`
            w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${showDeleteConfirm
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {showDeleteConfirm ? 'Click again to confirm' : 'Delete'}
        </button>
      </div>
    </Link>
  );
}
