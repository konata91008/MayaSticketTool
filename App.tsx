
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import KeywordManager from './components/KeywordManager';
import StickerGallery from './components/StickerGallery';
import StyleConfigurator, { STYLES, FONTS } from './components/StyleConfigurator';
import { generateStickerFromImage } from './services/geminiService';
import { Sticker, StickerStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Style, Font, and Behavior State
  const [selectedStyleId, setSelectedStyleId] = useState(STYLES[0].id);
  const [selectedFontId, setSelectedFontId] = useState(FONTS[0].id);
  const [includeText, setIncludeText] = useState(false);
  const [isAnthropomorphic, setIsAnthropomorphic] = useState(false);
  
  // API Key Management State
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio) {
        try {
          const has = await win.aistudio.hasSelectedApiKey();
          setHasApiKey(has);
        } catch (e) {
          console.error("Error checking API key status", e);
          setHasApiKey(false);
        }
      } else {
        // Fallback for environments where aistudio object is missing
        setHasApiKey(true);
      }
      setCheckingKey(false);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio) {
      try {
        await win.aistudio.openSelectKey();
        // Assume success if no error thrown
        setHasApiKey(true);
      } catch (e) {
        console.error("Error selecting API key", e);
      }
    }
  };

  const handleImageSelect = (base64: string) => {
    setSelectedImage(base64);
    // Reset stickers if new image selected
    setStickers([]);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setKeywords([]);
    setStickers([]);
  };

  const handleAddKeyword = (keyword: string) => {
    setKeywords(prev => [...prev, keyword]);
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index));
  };

  const generateUUID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const startGeneration = useCallback(async () => {
    if (!selectedImage || keywords.length === 0) return;

    setIsGenerating(true);

    // Initialize sticker placeholders
    const newStickers: Sticker[] = keywords.map(keyword => ({
      id: generateUUID(),
      keyword,
      status: StickerStatus.LOADING,
    }));

    setStickers(newStickers);

    // Find prompts based on IDs
    const currentStyle = STYLES.find(s => s.id === selectedStyleId) || STYLES[0];
    const currentFont = FONTS.find(f => f.id === selectedFontId) || FONTS[0];

    // Scroll to gallery
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);

    // Process concurrently
    const promises = newStickers.map(async (sticker) => {
      try {
        const imageUrl = await generateStickerFromImage(
            selectedImage, 
            sticker.keyword, 
            includeText,
            currentStyle.promptModifier,
            currentFont.promptModifier,
            isAnthropomorphic
        );
        
        setStickers(prev => prev.map(s => 
          s.id === sticker.id 
            ? { ...s, status: StickerStatus.SUCCESS, imageUrl } 
            : s
        ));
      } catch (error: any) {
        console.error("Generation error:", error);
        
        // Handle API Key Permission Errors
        const errorString = error?.message || JSON.stringify(error);
        if (
          errorString.includes("API_KEY_SERVICE_BLOCKED") || 
          errorString.includes("PERMISSION_DENIED") || 
          errorString.includes("403") ||
          errorString.includes("Requested entity was not found")
        ) {
           console.warn("API Key issue detected. Resetting key state.");
           setHasApiKey(false);
        }

        setStickers(prev => prev.map(s => 
          s.id === sticker.id 
            ? { ...s, status: StickerStatus.ERROR, error: 'Failed' } 
            : s
        ));
      }
    });

    await Promise.all(promises);
    setIsGenerating(false);

  }, [selectedImage, keywords, includeText, selectedStyleId, selectedFontId, isAnthropomorphic]);

  if (checkingKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="animate-pulse text-pink-500 font-semibold tracking-widest">系統確認中...</div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center animate-fade-in-up border border-pink-100">
          <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">需要 API 金鑰</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            為了使用最強大的 <strong>Nano Banana Pro</strong> 模型來生成高品質貼圖，請先選擇您付費 GCP 專案的 API Key。<br/>
            <span className="text-xs text-pink-400 block mt-2">(不用擔心，這是為了確保能使用最高階的 Gemini 3 Pro 影像生成功能)</span>
          </p>
          {/* Error Message Hint */}
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg mb-4 text-left">
            <strong>注意：</strong> 如果您剛剛遇到錯誤，可能是因為您的 API Key 所在的專案沒有啟用 Generative Language API，或者沒有設定 Billing。請嘗試切換專案或檢查 GCP 設定。
          </div>
          <button
            onClick={handleSelectKey}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-1 mb-4"
          >
            選擇 API Key
          </button>
           <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-600 hover:underline flex items-center justify-center gap-1"
          >
            關於計費說明 (Billing Docs)
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-[#fff5f7]">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-100 rounded-full">
               Gemini Nano Banana Pro inside
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
              將您的照片變成<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                可愛 Q 版貼圖 (スタンプ)
              </span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg">
              上傳人物或寵物照片，加入情緒關鍵字，<br className="hidden md:block"/>
              讓 AI 設計師 <b>Maya</b> 為您繪製專屬貼圖包！
            </p>
          </div>

          <ImageUpload 
            selectedImage={selectedImage} 
            onImageSelect={handleImageSelect}
            onClear={handleClearImage}
          />

          {selectedImage && (
            <div className="animate-fade-in-up">
              
              <StyleConfigurator 
                selectedStyleId={selectedStyleId}
                onSelectStyle={setSelectedStyleId}
                selectedFontId={selectedFontId}
                onSelectFont={setSelectedFontId}
                includeText={includeText}
                onToggleText={setIncludeText}
                isAnthropomorphic={isAnthropomorphic}
                onToggleAnthropomorphic={setIsAnthropomorphic}
                disabled={isGenerating}
              />

              <KeywordManager 
                keywords={keywords}
                onAddKeyword={handleAddKeyword}
                onRemoveKeyword={handleRemoveKeyword}
                disabled={isGenerating}
              />

              <div className="flex flex-col items-center justify-center mt-10 gap-6">
                
                <button
                  onClick={startGeneration}
                  disabled={keywords.length === 0 || isGenerating}
                  className={`
                    group relative px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300
                    ${keywords.length === 0 || isGenerating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-black hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20'
                    }
                  `}
                >
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 pointer-events-none"></div>
                  {isGenerating ? (
                    <span className="flex items-center gap-3">
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                       Maya 繪製中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>✨</span>
                      {keywords.length > 0 ? `製作 ${keywords.length} 張貼圖` : '請先新增關鍵字'}
                    </span>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                * 使用 Nano Banana Pro 模型生成，每張貼圖約需 5-10 秒
              </p>
            </div>
          )}
        </div>

        <StickerGallery stickers={stickers} />
      </main>

      {/* Tailwind Custom Animations Config Inject */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-pop-in {
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
