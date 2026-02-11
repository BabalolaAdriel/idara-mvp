// NoteGenerator Component

import { useState } from 'react';
import { FileText, Download, Printer, Copy, Check, Loader } from 'lucide-react';
import { generateNotes } from '../services/geminiService.js';
import { NOTE_SECTIONS } from '../utils/constants.js';
import NoteSection from './NoteSection.jsx';

export default function NoteGenerator({ 
  transcript, 
  metadata, 
  onNotesGenerated 
}) {
  const [notes, setNotes] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress('Analyzing transcript...');

      const generatedNotes = await generateNotes(transcript, metadata);
      
      setProgress('Notes generated successfully!');
      setNotes(generatedNotes);
      
      if (onNotesGenerated) {
        onNotesGenerated(generatedNotes);
      }

      setTimeout(() => setProgress(''), 2000);
    } catch (err) {
      console.error('Error generating notes:', err);
      setError(err.message || 'Failed to generate notes');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAll = async () => {
    if (!notes) return;
    
    try {
      await navigator.clipboard.writeText(notes.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExport = () => {
    if (!notes) return;

    const blob = new Blob([notes.raw], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata?.title || 'notes'}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!notes) return;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Lecture Notes</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;padding:20px;}h1,h2{color:#333;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h1>${metadata?.title || 'Lecture Notes'}</h1>`);
    printWindow.document.write(`<pre style="white-space: pre-wrap;">${notes.raw}</pre>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      {!notes && (
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Generate Study Notes</h3>
            <p className="text-gray-600">
              Transform your transcript into structured study materials with AI
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !transcript}
            className="btn-primary inline-flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Generate Notes</span>
              </>
            )}
          </button>

          {!transcript && (
            <p className="text-sm text-red-600">
              No transcript available. Please record and transcribe first.
            </p>
          )}
        </div>
      )}

      {/* Progress */}
      {progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm flex items-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>{progress}</span>
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Generated Notes */}
      {notes && (
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Study Notes</h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyAll}
                className="btn-secondary flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleExport}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={handlePrint}
                className="btn-secondary flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Note Sections */}
          <div className="space-y-3">
            {NOTE_SECTIONS.map((section, index) => (
              <NoteSection
                key={section.id}
                id={section.id}
                title={section.title}
                icon={section.icon}
                content={notes.structured[section.id] || ''}
                defaultOpen={index === 0}
              />
            ))}
          </div>

          {/* Metadata */}
          <div className="card bg-gray-50">
            <div className="text-sm text-gray-600 space-y-1">
              <p>Generated by {notes.metadata.model}</p>
              <p>
                {new Date(notes.metadata.generatedAt).toLocaleString()}
              </p>
              <p>~{notes.metadata.tokenCount} tokens</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
