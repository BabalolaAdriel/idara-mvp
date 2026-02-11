// NoteSection Component

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function NoteSection({ 
  id, 
  title, 
  icon, 
  content, 
  defaultOpen = false 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <div className="note-section">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="note-section-header w-full"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-gray-900 text-left">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
          
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="note-section-content markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
