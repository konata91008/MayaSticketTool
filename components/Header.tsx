import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 sticky top-0 z-50 border-b border-pink-100">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-pink-400 to-purple-500 rounded-xl p-2.5 shadow-lg transform -rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight font-sans">
              Maya <span className="text-pink-400 font-light mx-1">の</span> 貼圖製造所
            </h1>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase font-semibold">
              AI Sticker Studio
            </p>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-600 font-mono">Model: Nano Banana Pro</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;