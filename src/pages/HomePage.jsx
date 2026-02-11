// HomePage Component

import { Link } from 'react-router-dom';
import { Mic, Library, BookOpen, Clock, FileText, TrendingUp } from 'lucide-react';
import { formatDuration, formatNumber } from '../utils/formatters.js';
import useStorage from '../hooks/useStorage.js';
import useNetworkStatus from '../hooks/useNetworkStatus.js';
import { APP_CONFIG } from '../utils/constants.js';

export default function HomePage() {
  const { lectures, stats } = useStorage();
  const { isOnline } = useNetworkStatus();

  const recentLectures = lectures.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            {APP_CONFIG.name}
          </h1>
          <p className="text-xl text-primary-100 mb-6">
            {APP_CONFIG.tagline}
          </p>
          <p className="text-primary-200 mb-8">
            AI-powered safety net for students. Record, transcribe, and transform your lectures 
            into structured study materials with optional video animations.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/record" className="btn bg-white text-primary-700 hover:bg-primary-50">
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </Link>
            <Link to="/library" className="btn bg-primary-800 text-white hover:bg-primary-900">
              <Library className="w-5 h-5 mr-2" />
              View Library
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={FileText}
            label="Total Lectures"
            value={formatNumber(stats.count)}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Total Duration"
            value={formatDuration(stats.totalDuration)}
            color="green"
          />
          <StatCard
            icon={BookOpen}
            label="Processed"
            value={formatNumber(stats.processedCount)}
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="This Week"
            value={formatNumber(stats.count)}
            color="orange"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard
            icon={Mic}
            title="Record New Lecture"
            description="Start recording and transcribing your lecture in real-time"
            to="/record"
            color="red"
            available={true}
          />
          <ActionCard
            icon={Library}
            title="Process Saved Lectures"
            description="Generate study notes and videos from your saved transcripts"
            to="/library"
            color="primary"
            available={isOnline}
            unavailableMessage="Requires internet connection"
          />
        </div>
      </div>

      {/* Recent Lectures */}
      {recentLectures.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Lectures</h2>
            <Link to="/library" className="text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentLectures.map((lecture) => (
              <Link
                key={lecture.id}
                to={`/lecture/${lecture.id}`}
                className="card-hover flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {lecture.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{new Date(lecture.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{formatDuration(lecture.duration)}</span>
                    {lecture.isProcessed && (
                      <>
                        <span>•</span>
                        <span className="text-green-600">Processed</span>
                      </>
                    )}
                  </div>
                </div>
                
                <FileText className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started (for new users) */}
      {lectures.length === 0 && (
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300">
          <div className="text-center max-w-2xl mx-auto">
            <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Idara!
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't recorded any lectures yet. Get started by recording your first lecture 
              and experience the power of AI-assisted learning.
            </p>
            <Link to="/record" className="btn-primary inline-flex items-center">
              <Mic className="w-5 h-5 mr-2" />
              Record Your First Lecture
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, to, color, available, unavailableMessage }) {
  const colors = {
    red: 'bg-red-100 text-red-600',
    primary: 'bg-primary-100 text-primary-600',
  };

  const content = (
    <div className={`card-hover ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {!available && unavailableMessage && (
            <p className="text-xs text-red-600 mt-2">⚠️ {unavailableMessage}</p>
          )}
        </div>
      </div>
    </div>
  );

  if (!available) {
    return <div>{content}</div>;
  }

  return <Link to={to}>{content}</Link>;
}
