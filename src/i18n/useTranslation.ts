'use client';

import { useParams } from 'next/navigation';
import { Locale, defaultLocale } from './config';
import { getMessages, isAITranslated, Messages } from './messages';

/**
 * Custom hook for translations in client components
 *
 * Usage:
 * ```tsx
 * const { t, locale, messages, isAI } = useTranslation();
 *
 * // Simple translation
 * <h1>{t('hero.title')}</h1>
 *
 * // With parameters
 * <p>{t('dashboard.welcome', { name: 'John' })}</p>
 *
 * // Direct access to messages
 * <span>{messages.common.loading}</span>
 * ```
 */
export function useTranslation() {
  const params = useParams();
  const locale = (params?.locale as Locale) || defaultLocale;
  const messages = getMessages(locale);
  const isAI = isAITranslated(locale);

  /**
   * Translation function with nested key support and parameter interpolation
   * @param key - Dot-notation key (e.g., 'hero.title', 'auth.login.submit')
   * @param params - Optional parameters for interpolation (e.g., { name: 'John', count: 5 })
   * @returns Translated string
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = messages;

    // Navigate through nested object
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // If value is not a string, return the key
    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" is not a string`);
      return key;
    }

    // Interpolate parameters if provided
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(`{${paramKey}}`, String(paramValue));
      }, value);
    }

    return value;
  };

  /**
   * Get translation with fallback
   * @param key - Translation key
   * @param fallback - Fallback text if key not found
   * @param params - Optional parameters for interpolation
   */
  const tWithFallback = (
    key: string,
    fallback: string,
    params?: Record<string, string | number>
  ): string => {
    try {
      const translation = t(key, params);
      return translation === key ? fallback : translation;
    } catch {
      return fallback;
    }
  };

  /**
   * Check if a translation key exists
   * @param key - Translation key to check
   */
  const hasTranslation = (key: string): boolean => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return false;
    }

    return typeof value === 'string';
  };

  return {
    /** Current locale */
    locale,
    /** Translation function */
    t,
    /** Translation with fallback */
    tWithFallback,
    /** Check if translation exists */
    hasTranslation,
    /** All messages for current locale */
    messages,
    /** Whether current locale uses AI translation */
    isAI,
  };
}

/**
 * Server-side translation helper
 * Use this in Server Components
 *
 * @param locale - The locale to use
 * @param key - Dot-notation key
 * @param params - Optional parameters for interpolation
 *
 * Usage:
 * ```tsx
 * import { getTranslation } from '@/i18n/useTranslation';
 *
 * export default function Page({ params }: { params: { locale: Locale } }) {
 *   const title = getTranslation(params.locale, 'hero.title');
 *   return <h1>{title}</h1>;
 * }
 * ```
 */
export function getTranslation(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const messages = getMessages(locale);
  const keys = key.split('.');
  let value: any = messages;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation key "${key}" is not a string`);
    return key;
  }

  // Interpolate parameters if provided
  if (params) {
    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(`{${paramKey}}`, String(paramValue));
    }, value);
  }

  return value;
}

/**
 * Get all messages for a specific section
 * Useful for passing to child components
 *
 * @param locale - The locale to use
 * @param section - Section key (e.g., 'auth', 'property')
 *
 * Usage:
 * ```tsx
 * const authMessages = getSection(locale, 'auth');
 * // Returns: { login: {...}, register: {...}, ... }
 * ```
 */
export function getSection<K extends keyof Messages>(
  locale: Locale,
  section: K
): Messages[K] {
  const messages = getMessages(locale);
  return messages[section];
}

/**
 * Type-safe translation keys helper
 * This helps with autocomplete in IDEs
 */
export type TranslationKey =
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'nav.home'
  | 'nav.properties'
  | 'hero.title'
  | 'hero.subtitle'
  | 'property.types.villa'
  | 'property.types.apartment'
  | 'auth.login.title'
  | 'auth.register.title'
  | 'dashboard.title'
  | 'booking.title'
  | 'contact.title'
  | 'about.title'
  | 'footer.copyright'
  | string; // Allow other keys for flexibility
