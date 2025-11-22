/**
 * i18n Module - Internationalization for Estate Bali
 *
 * This module provides comprehensive internationalization support for the application.
 * Supports: English (en), Indonesian (id), Hebrew (he), Arabic (ar), Chinese (zh)
 *
 * @example Client Component Usage
 * ```tsx
 * 'use client';
 * import { useTranslation } from '@/i18n';
 *
 * export default function MyComponent() {
 *   const { t, locale, isAI } = useTranslation();
 *
 *   return (
 *     <div>
 *       <h1>{t('hero.title')}</h1>
 *       <p>{t('dashboard.welcome', { name: 'John' })}</p>
 *       {isAI && <span>{t('hero.aiTranslatedNotice')}</span>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Server Component Usage
 * ```tsx
 * import { getTranslation, getSection } from '@/i18n';
 *
 * export default function Page({ params }: { params: { locale: Locale } }) {
 *   const title = getTranslation(params.locale, 'hero.title');
 *   const authMessages = getSection(params.locale, 'auth');
 *
 *   return <h1>{title}</h1>;
 * }
 * ```
 */

// Configuration
export {
  supportedLocales,
  defaultLocale,
  rtlLocales,
  isSupportedLocale,
  getLocale,
  isRTL,
  type Locale,
} from './config';

// Messages
export {
  getMessages,
  isAITranslated,
  type Messages,
} from './messages';

// Hooks and utilities
export {
  useTranslation,
  getTranslation,
  getSection,
  type TranslationKey,
} from './useTranslation';
