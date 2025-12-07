import React from 'react';
import { StyleConfiguratorProps, StyleOption, FontOption } from '../types';
import { TRANSLATIONS } from '../translations';

export const STYLES: StyleOption[] = [
  {
    id: 'anime_chibi',
    name: '日系 Q 版',
    description: '軟萌可愛、大眼腮紅、線條圓潤，像市面上熱門的少女貼圖。',
    promptModifier: 'SUPER KAWAII ANIME STICKER (Moe Chibi / Menhera Style). \n1. **LINES**: Bold, smooth, uniform dark outlines (like a die-cut sticker). \n2. **FACE**: Large expressive anime eyes (shiny & cute), distinct blush marks on cheeks, tiny nose/mouth. \n3. **PROPORTIONS**: Super Deformed (SD), 2-heads tall. Big soft head, tiny squishy body. \n4. **COLOR**: Flat cel-shading, pastel and bright colors, no muddy textures. \n5. **VIBE**: Soft, emotional, and extremely cute (Moe).', 
    previewImage: '', 
  },
  {
    id: 'crayon',
    name: '手繪蠟筆',
    description: '溫暖筆觸、粗糙邊緣，像童書一樣可愛。',
    promptModifier: 'HAND-DRAWN CRAYON ART. Textured stroke, rough edges, warm and soft colors, children\'s book illustration style. Character is lying on back, relaxed.',
    previewImage: '',
  },
  {
    id: 'retro_cartoon',
    name: '美式卡通',
    description: '粗框線、高飽和度，像飛天小女警的風格。',
    promptModifier: 'RETRO AMERICAN CARTOON (CN Style). Very thick black outlines, solid bold colors, geometric shapes, expressive. Energetic pose.',
    previewImage: '',
  },
  {
    id: 'watercolor',
    name: '夢幻水彩',
    description: '柔和暈染、藝術感強，適合優雅的貼圖。',
    promptModifier: 'SOFT WATERCOLOR STICKER STYLE. \n1. **LINES**: Delicate, organic pencil or fine ink outlines (Dark Grey/Brown). NOT thick vector lines. \n2. **COLOR**: Soft pastel watercolor washes, wet-on-wet texture, gentle gradients, artistic blending. \n3. **VIBE**: Dreamy, airy, elegant, and warm. \n4. **DETAILS**: Hand-painted aesthetic with visible paper texture grain. \n5. **FORM**: Clear character silhouette despite the soft coloring.',
    previewImage: '',
  }
];

export const FONTS: FontOption[] = [
  {
    id: 'rounded',
    name: '圓體 (預設)',
    description: '圓潤可愛，易讀性高。',
    promptModifier: 'Use a **Rounded Sans-Serif (Soft Bubble)** font. Cute and modern.',
    previewClass: 'font-sans font-bold',
  },
  {
    id: 'handwriting',
    name: '手寫體',
    description: '隨性親切，像親手寫的字。',
    promptModifier: 'Use a **Casual Handwriting / Marker** font. Irregular and personal.',
    previewClass: 'font-serif italic',
  },
  {
    id: 'comic',
    name: '漫畫體',
    description: '充滿氣勢，適合誇張表情。',
    promptModifier: 'Use a **Bold Comic / POP** font. Thick strokes, explosive style.',
    previewClass: 'font-black tracking-tighter transform -skew-x-6',
  },
  {
    id: 'pixel',
    name: '像素體',
    description: '復古遊戲風，懷舊感十足。',
    promptModifier: 'Use a **Pixel Art / 8-bit** font. Retro gaming style.',
    previewClass: 'font-mono tracking-widest',
  }
];

const StyleConfigurator: React.FC<StyleConfiguratorProps> = ({
  selectedStyleId,
  onSelectStyle,
  selectedFontId,
  onSelectFont,
  includeText,
  onToggleText,
  isAnthropomorphic,
  onToggleAnthropomorphic,
  disabled,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 animate-fade-in-up delay-100">
      
      {/* 畫風選擇 */}
      <div className="mb-8">
        <label className="block text-gray-800 font-bold mb-4 flex items-center gap-2">
           <span className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
           {t.step2Title}
        </label>
        
        {/* Changed to 2 columns for text-focused cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              disabled={disabled}
              className={`
                relative flex flex-col p-5 rounded-2xl transition-all duration-200 text-left group
                ${selectedStyleId === style.id 
                  ? 'bg-pink-50 ring-2 ring-pink-500 shadow-sm' 
                  : 'bg-white border border-gray-200 hover:border-pink-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex justify-between items-start w-full mb-1">
                <span className={`font-black text-lg transition-colors ${selectedStyleId === style.id ? 'text-pink-600' : 'text-gray-800'}`}>
                  {t[`style_${style.id}_name`] || style.name}
                </span>
                
                {/* Selection Checkmark */}
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                  ${selectedStyleId === style.id ? 'bg-pink-500 scale-100' : 'bg-gray-100 scale-90'}
                `}>
                  {selectedStyleId === style.id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white animate-pop-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-pink-300 transition-colors"></div>
                  )}
                </div>
              </div>
              
              <span className={`text-sm font-medium leading-relaxed transition-colors ${selectedStyleId === style.id ? 'text-pink-900/70' : 'text-gray-500'}`}>
                {t[`style_${style.id}_desc`] || style.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 角色行為設定 (擬人化) */}
      <div className="mb-8">
        <label className="block text-gray-800 font-bold mb-4 flex items-center gap-2">
           <span className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
           {t.step3Title}
        </label>
        
        <div 
          onClick={() => !disabled && onToggleAnthropomorphic(!isAnthropomorphic)}
          className={`
            cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
            ${isAnthropomorphic 
              ? 'bg-purple-50 border-purple-300 shadow-sm' 
              : 'bg-white border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="flex-1">
            <h3 className={`font-bold ${isAnthropomorphic ? 'text-purple-700' : 'text-gray-700'}`}>
              {t.anthroTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {isAnthropomorphic ? t.anthroOn : t.anthroOff}
            </p>
          </div>

          <div className={`
             ml-4 w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out relative
             ${isAnthropomorphic ? 'bg-purple-500' : 'bg-gray-300'}
          `}>
             <div className={`
               w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
               ${isAnthropomorphic ? 'translate-x-5' : 'translate-x-0'}
             `}></div>
          </div>
        </div>
      </div>

      {/* 文字與字型選擇 */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <label className="text-gray-800 font-bold flex items-center gap-2">
            <span className="bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
            {t.step4Title}
          </label>
          
          {/* Text Toggle Switch */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-pink-100 cursor-pointer hover:shadow-md transition-shadow" onClick={() => !disabled && onToggleText(!includeText)}>
             <span className={`text-xs font-bold ${!includeText ? 'text-gray-800' : 'text-gray-400'}`}>
               {t.textOff}
             </span>
             <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${includeText ? 'bg-pink-500' : 'bg-gray-300'}`}>
               <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${includeText ? 'translate-x-4' : 'translate-x-0'}`}></div>
             </div>
             <span className={`text-xs font-bold ${includeText ? 'text-pink-600' : 'text-gray-400'}`}>
               {t.textOn}
             </span>
           </div>
        </div>

        {includeText && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
            {FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => onSelectFont(font.id)}
                disabled={disabled}
                className={`
                  relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300
                  ${selectedFontId === font.id 
                    ? 'bg-blue-50 ring-2 ring-blue-400 scale-105 shadow-md' 
                    : 'bg-white hover:bg-gray-50 border border-gray-100 hover:shadow-lg'
                  }
                `}
              >
                <div className="w-full h-12 bg-gray-50 rounded-lg mb-2 flex items-center justify-center">
                  <span className={`text-xl text-gray-800 ${font.previewClass}`}>Aa</span>
                </div>
                <span className={`font-bold text-sm ${selectedFontId === font.id ? 'text-blue-600' : 'text-gray-700'}`}>
                  {t[`font_${font.id}_name`] || font.name}
                </span>
                 {selectedFontId === font.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center text-white text-[10px] animate-pop-in">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleConfigurator;