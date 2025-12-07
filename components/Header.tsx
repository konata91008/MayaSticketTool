import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const t = TRANSLATIONS[lang];

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
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight font-sans flex items-center gap-2">
              {t.appTitle}
              <span className="text-xs font-mono bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full border border-pink-200">v1.0</span>
            </h1>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase font-semibold">
              {t.appSubtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-600 font-mono">{t.modelBadge}</span>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-pink-500 transition-colors font-bold text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.686 0A11.953 11.953 0 0112 10.5c2.998 0 5.74-1.1 7.843-2.918m-15.686 0A8.959 8.959 0 013 12c0 .778.099 1.533.284 2.253" />
              </svg>
              <span>
                {lang === 'zh-TW' && '繁體中文'}
                {lang === 'en' && 'English'}
                {lang === 'ja' && '日本語'}
                {lang === 'ko' && '한국어'}
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block animate-fade-in z-50">
              <button onClick={() => setLang('zh-TW')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-pink-50 ${lang === 'zh-TW' ? 'text-pink-500 font-bold' : 'text-gray-700'}`}>繁體中文</button>
              <button onClick={() => setLang('en')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-pink-50 ${lang === 'en' ? 'text-pink-500 font-bold' : 'text-gray-700'}`}>English</button>
              <button onClick={() => setLang('ja')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-pink-50 ${lang === 'ja' ? 'text-pink-500 font-bold' : 'text-gray-700'}`}>日本語</button>
              <button onClick={() => setLang('ko')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-pink-50 ${lang === 'ko' ? 'text-pink-500 font-bold' : 'text-gray-700'}`}>한국어</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;