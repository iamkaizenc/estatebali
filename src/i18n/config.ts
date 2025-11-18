// i18n Configuration
export const supportedLocales = ['en', 'id', 'he', 'ar', 'zh'] as const;

export type Locale = typeof supportedLocales[number];

export const defaultLocale: Locale = 'en';

// RTL languages
export const rtlLocales: Locale[] = ['ar', 'he'];

// Check if a locale is supported
export function isSupportedLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

// Get locale from params or default
export function getLocale(locale: string | undefined): Locale {
  if (locale && isSupportedLocale(locale)) {
    return locale;
  }
  return defaultLocale;
}

// Check if locale is RTL
export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

