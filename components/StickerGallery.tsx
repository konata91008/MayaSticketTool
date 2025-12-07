import React from 'react';
import { Sticker, StickerStatus, Language, StickerGalleryProps } from '../types';
import { TRANSLATIONS } from '../translations';

const StickerCard: React.FC<{ sticker: Sticker; lang: Language }> = ({ sticker, lang }) => {
  const t = TRANSLATIONS[lang];

  const downloadImage = () => {
    if (sticker.imageUrl) {
      const link = document.createElement('a');
      link.href = sticker.imageUrl;
      link.download = `maya-sticker-${sticker.keyword.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full transform transition-all hover:-translate-y-1 hover:shadow-xl group">
      <div className="relative aspect-square bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 flex items-center justify-center p-4">
        {sticker.status === StickerStatus.LOADING && (
          <div className="flex flex-col items-center z-10">
             <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-3"></div>
             <p className="text-xs text-pink-500 font-bold animate-pulse tracking-wide">{t.generateBtnActive}</p>
          </div>
        )}
        
        {sticker.status === StickerStatus.ERROR && (
          <div className="text-center p-4 z-10">
            <div className="bg-red-50 text-red-500 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-xs text-red-400 font-medium">{t.errorGen}</p>
          </div>
        )}

        {sticker.status === StickerStatus.SUCCESS && sticker.imageUrl && (
          <img 
            src={sticker.imageUrl} 
            alt={sticker.keyword} 
            className="w-full h-full object-contain animate-fade-in drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        )}
      </div>
      
      <div className="p-4 bg-white flex flex-col flex-1 justify-between relative">
        <h3 className="font-bold text-gray-800 text-center mb-3 text-lg">{sticker.keyword}</h3>
        
        {sticker.status === StickerStatus.SUCCESS && (
          <button 
            onClick={downloadImage}
            className="w-full mt-auto bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-pink-500 active:bg-pink-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {t.download}
          </button>
        )}
      </div>
    </div>
  );
};

const StickerGallery: React.FC<StickerGalleryProps> = ({ stickers, lang }) => {
  const t = TRANSLATIONS[lang];

  if (stickers.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-20 px-4">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
           {t.galleryTitle}
        </h2>
        <span className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-full">
          {stickers.filter(s => s.status === StickerStatus.SUCCESS).length} / {stickers.length} {t.galleryCount}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stickers.map((sticker) => (
          <StickerCard key={sticker.id} sticker={sticker} lang={lang} />
        ))}
      </div>
    </div>
  );
};

export default StickerGallery;