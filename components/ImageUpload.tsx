import React, { useRef, useState } from 'react';
import { ImageUploadProps } from '../types';
import { TRANSLATIONS } from '../translations';

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage, onClear, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片格式檔案');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  if (selectedImage) {
    return (
      <div className="w-full max-w-md mx-auto mb-8 animate-fade-in">
        <div className="relative group rounded-3xl overflow-hidden shadow-xl border-[6px] border-white bg-white rotate-1 hover:rotate-0 transition-transform duration-300">
          <img 
            src={selectedImage} 
            alt="Reference" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
             <button 
              onClick={onClear}
              className="bg-white/20 backdrop-blur-md text-white border border-white/50 px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-pink-500 transition-all transform hover:scale-105"
             >
               {t.changePhoto}
             </button>
          </div>
        </div>
        <p className="text-center text-pink-400 mt-4 font-bold tracking-wider text-sm flex items-center justify-center gap-2">
          <span className="bg-pink-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">✓</span>
          {t.step1Title}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          cursor-pointer border-3 border-dashed rounded-[2rem] h-64 flex flex-col items-center justify-center
          transition-all duration-300 ease-in-out relative overflow-hidden
          ${isDragging 
            ? 'border-pink-500 bg-pink-50 scale-102' 
            : 'border-pink-200 bg-white hover:border-pink-400 hover:bg-pink-50/30'
          }
        `}
      >
        <div className={`bg-pink-100 p-5 rounded-full mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
        </div>
        <p className="text-gray-700 font-bold text-lg">{t.step1UploadTitle}</p>
        <p className="text-gray-400 text-sm mt-1">{t.step1UploadDesc}</p>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <p className="text-center text-gray-500 mt-3 text-sm font-medium">{t.step1Hint}</p>
    </div>
  );
};

export default ImageUpload;