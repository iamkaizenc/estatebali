import { Locale, defaultLocale } from './config';

// Message structure with support for per-section AI translation flags
export interface SectionMessages {
  heroTitle: string;
  heroSubtitle: string;
  aiTranslatedNotice: string;
  // Future sections can be added here with their own aiTranslated flags
  // about?: { title: string; content: string; aiTranslated?: boolean };
  // features?: { title: string; items: string[]; aiTranslated?: boolean };
}

export type Messages = Record<Locale, SectionMessages>;

export const messages: Messages = {
  en: {
    heroTitle: 'Find Your Dream Property\nin Bali',
    heroSubtitle: 'Discover luxury villas, modern apartments, and prime land in paradise.\nYour perfect property awaits.',
    aiTranslatedNotice: 'This section was translated by AI.',
  },
  id: {
    heroTitle: 'Temukan Properti Impian Anda\ndi Bali',
    heroSubtitle: 'Temukan villa mewah, apartemen modern, dan tanah pilihan di surga.\nProperti sempurna Anda menanti.',
    aiTranslatedNotice: 'Bagian ini diterjemahkan oleh AI.',
  },
  he: {
    heroTitle: 'מצא את הנכס החלומי שלך\nבבאלי',
    heroSubtitle: 'גלה וילות יוקרה, דירות מודרניות ואדמות פרימיום בגן עדן.\nהנכס המושלם שלך מחכה.',
    aiTranslatedNotice: 'סעיף זה תורגם על ידי AI.',
  },
  ar: {
    heroTitle: 'اعثر على عقار أحلامك\nفي بالي',
    heroSubtitle: 'اكتشف الفيلات الفاخرة والشقق الحديثة والأراضي المميزة في الجنة.\nعقارك المثالي ينتظرك.',
    aiTranslatedNotice: 'تمت ترجمة هذا القسم بواسطة AI.',
  },
  zh: {
    heroTitle: '在巴厘岛找到您的梦想房产',
    heroSubtitle: '在天堂发现豪华别墅、现代公寓和优质土地。\n您完美的房产正在等待。',
    aiTranslatedNotice: '此部分由AI翻译。',
  },
};

// Helper to get messages for a locale
export function getMessages(locale: Locale): SectionMessages {
  return messages[locale] || messages[defaultLocale];
}

// Helper to check if a section is AI translated
// For now, all non-default locales are AI translated
export function isAITranslated(locale: Locale): boolean {
  return locale !== 'en';
}

