import React, { useState, useRef, useEffect } from 'react';
import { KeywordManagerProps } from '../types';
import { TRANSLATIONS } from '../translations';

const KeywordManager: React.FC<KeywordManagerProps> = ({ 
  keywords, 
  onAddKeyword, 
  onRemoveKeyword,
  disabled,
  lang
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  const add = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      onAddKeyword(trimmed);
      setInputValue(''); // Clear input immediately
      // Keep focus on input for continuous typing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-pink-100">
      <div className="mb-5">
        <label className="block text-gray-800 font-bold mb-3 flex items-center gap-2">
           <span className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
           {t.step5Title}
        </label>
        <div className="flex gap-2 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={t.keywordPlaceholder}
            className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all shadow-inner"
          />
          <button
            onClick={add}
            disabled={!inputValue.trim() || disabled}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md active:translate-y-0.5"
          >
            {t.keywordAdd}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 ml-1">
          {t.keywordHint}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[48px]">
        {keywords.length === 0 && (
          <div className="w-full text-center py-6 text-gray-400 italic bg-white/50 rounded-xl border-2 border-dashed border-pink-100">
            {t.keywordEmpty}
          </div>
        )}
        {keywords.map((kw, index) => (
          <div 
            key={`${kw}-${index}`} 
            className="animate-pop-in flex items-center bg-white text-gray-700 px-4 py-2 rounded-xl border border-pink-200 shadow-sm hover:shadow-md transition-all group"
          >
            <span className="mr-2 font-bold text-sm text-pink-600">#</span>
            <span className="mr-2 font-medium">{kw}</span>
            <button
              onClick={() => onRemoveKeyword(index)}
              disabled={disabled}
              className="text-gray-300 hover:text-red-400 focus:outline-none transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordManager;