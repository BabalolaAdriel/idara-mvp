// ConceptSelector Component

import { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';

export default function ConceptSelector({ 
  concepts = [], 
  onSelectionChange 
}) {
  const [selected, setSelected] = useState(() => {
    return concepts.filter(c => c.selected).map(c => c.title);
  });

  const toggleConcept = (title) => {
    const newSelected = selected.includes(title)
      ? selected.filter(t => t !== title)
      : [...selected, title];
    
    setSelected(newSelected);
    
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

  const selectAll = () => {
    const all = concepts.map(c => c.title);
    setSelected(all);
    if (onSelectionChange) {
      onSelectionChange(all);
    }
  };

  const clearAll = () => {
    setSelected([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  if (concepts.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No concepts available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Select Concepts ({selected.length}/{concepts.length})
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={selectAll}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Concept List */}
      <div className="space-y-2">
        {concepts.map((concept, index) => {
          const isSelected = selected.includes(concept.title);
          
          return (
            <button
              key={index}
              onClick={() => toggleConcept(concept.title)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className="pt-1">
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-primary-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {concept.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {concept.description}
                  </p>
                  {concept.reason && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      💡 {concept.reason}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 Tip: Select 3-5 concepts for best results. Videos will be generated for each selected concept.
        </p>
      </div>
    </div>
  );
}
