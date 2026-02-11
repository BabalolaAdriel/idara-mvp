// TranscriptViewer Component

import { useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function TranscriptViewer({ 
  transcript, 
  confidence = 0, 
  autoScroll = true 
}) {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript, autoScroll]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getConfidenceColor = () => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-gray-900">Transcript</h3>
          {confidence > 0 && (
            <span className={`text-xs font-medium ${getConfidenceColor()}`}>
              {Math.round(confidence * 100)}% confidence
            </span>
          )}
        </div>
        
        {transcript && (
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="p-4 max-h-96 overflow-y-auto scrollbar-thin bg-gray-50"
      >
        {transcript ? (
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {transcript}
          </p>
        ) : (
          <p className="text-gray-400 italic text-center py-8">
            Transcript will appear here as you record...
          </p>
        )}
      </div>
    </div>
  );
}
