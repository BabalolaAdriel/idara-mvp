// LibraryPage Component

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Trash2 } from 'lucide-react';
import LectureList from '../components/LectureList.jsx';
import useStorage from '../hooks/useStorage.js';

export default function LibraryPage() {
  const { lectures, deleteLecture, searchLectures, loadLectures, exportData } = useStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, processed, unprocessed
  const [sortBy, setSortBy] = useState('date'); // date, title, duration
  const [filteredLectures, setFilteredLectures] = useState([]);

  // Filter and sort lectures
  useEffect(() => {
    let results = [...lectures];

    // Filter by status
    if (filterStatus === 'processed') {
      results = results.filter(l => l.isProcessed);
    } else if (filterStatus === 'unprocessed') {
      results = results.filter(l => !l.isProcessed);
    }

    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return b.duration - a.duration;
        case 'date':
        default:
          return b.date - a.date;
      }
    });

    setFilteredLectures(results);
  }, [lectures, filterStatus, sortBy]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchLectures(query);
    } else {
      await loadLectures();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      await deleteLecture(id);
    }
  };

  const handleExport = async () => {
    await exportData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your recorded lectures
          </p>
        </div>

        <button
          onClick={handleExport}
          className="btn-secondary flex items-center space-x-2"
          disabled={lectures.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Export All</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search lectures by title or tags..."
            className="input pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">All Lectures</option>
              <option value="processed">Processed Only</option>
              <option value="unprocessed">Unprocessed Only</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="date">Date (Newest First)</option>
              <option value="title">Title (A-Z)</option>
              <option value="duration">Duration (Longest First)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filterStatus !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Showing:</span>
              {searchQuery && (
                <span className="badge bg-primary-100 text-primary-700">
                  Search: "{searchQuery}"
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="badge bg-primary-100 text-primary-700">
                  {filterStatus === 'processed' ? 'Processed' : 'Unprocessed'}
                </span>
              )}
            </div>
            
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                loadLectures();
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Lectures List */}
      <LectureList
        lectures={filteredLectures}
        onDelete={handleDelete}
      />

      {/* Stats Summary */}
      {lectures.length > 0 && (
        <div className="card bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total: {lectures.length} lectures</span>
            <span>
              Processed: {lectures.filter(l => l.isProcessed).length} | 
              Unprocessed: {lectures.filter(l => !l.isProcessed).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
