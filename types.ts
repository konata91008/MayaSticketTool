
export enum StickerStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Language = 'zh-TW' | 'en' | 'ja' | 'ko';

export interface Sticker {
  id: string;
  keyword: string;
  status: StickerStatus;
  imageUrl?: string;
  error?: string;
}

export interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  lang: Language;
}

export interface KeywordManagerProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (index: number) => void;
  disabled: boolean;
  lang: Language;
}

export interface StickerGalleryProps {
  stickers: Sticker[];
  lang: Language;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  promptModifier: string; // The text to inject into the AI prompt
  previewImage: string; // URL or Base64 string of the example image
}

export interface FontOption {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  previewClass: string;
}

export interface StyleConfiguratorProps {
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
  selectedFontId: string;
  onSelectFont: (id: string) => void;
  includeText: boolean;
  onToggleText: (include: boolean) => void;
  isAnthropomorphic: boolean;
  onToggleAnthropomorphic: (val: boolean) => void;
  disabled: boolean;
  lang: Language;
}