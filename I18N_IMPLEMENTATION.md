# Multilingual Support Implementation

## Overview

This document describes the i18n (internationalization) implementation for the Estate Bali Next.js application, supporting 5 languages with AI translation notices for non-original content.

## Supported Languages

- **English (`en`)** - Default/Original language
- **Indonesian (`id`)** - Bahasa Indonesia
- **Hebrew (`he`)** - עברית (RTL)
- **Arabic (`ar`)** - العربية (RTL)
- **Chinese (`zh`)** - 中文

## File Structure

### Created Files

1. **`src/i18n/config.ts`**
   - Defines supported locales
   - Exports `Locale` type
   - Provides helper functions: `getLocale()`, `isRTL()`, `isSupportedLocale()`
   - RTL languages: Arabic and Hebrew

2. **`src/i18n/messages.ts`**
   - Contains all translated messages
   - Structure: `Messages` type with `SectionMessages` interface
   - Current keys: `heroTitle`, `heroSubtitle`, `aiTranslatedNotice`
   - Helper functions: `getMessages()`, `isAITranslated()`

3. **`src/app/[locale]/layout.tsx`**
   - Locale-aware root layout
   - Sets `<html lang={locale}>` and `dir={rtl ? 'rtl' : 'ltr'}`
   - Validates locale and falls back to default
   - Generates static params for all supported locales

4. **`src/app/[locale]/page.tsx`**
   - Homepage with translations
   - Displays AI translation notice for non-English locales
   - Uses messages from `messages.ts`

### Modified Files

1. **`src/app/layout.tsx`**
   - Simplified to minimal root layout
   - Actual layout logic moved to `[locale]/layout.tsx`

2. **`src/app/page.tsx`**
   - Redirects root path (`/`) to default locale (`/en`)

## Messages Structure

### Current Keys

```typescript
interface SectionMessages {
  heroTitle: string;           // Main hero title
  heroSubtitle: string;        // Hero subtitle/description
  aiTranslatedNotice: string;  // AI translation notice text
}
```

### Example Usage

```typescript
import { getMessages } from '@/i18n/messages';
import { getLocale } from '@/i18n/config';

const locale = getLocale(params.locale);
const messages = getMessages(locale);
const isOriginal = !isAITranslated(locale);

// Use messages
<h1>{messages.heroTitle}</h1>
<p>{messages.heroSubtitle}</p>

// Show AI notice only for non-original languages
{!isOriginal && <p>{messages.aiTranslatedNotice}</p>}
```

## Routing Structure

All routes are now prefixed with locale:

- `/` → Redirects to `/en`
- `/en` → English homepage
- `/id` → Indonesian homepage
- `/he` → Hebrew homepage (RTL)
- `/ar` → Arabic homepage (RTL)
- `/zh` → Chinese homepage

Other routes should follow the same pattern:
- `/en/properties`
- `/id/properties`
- `/he/properties`
- etc.

## AI Translation Notice

The AI translation notice appears:
- ✅ For all non-English locales (`id`, `he`, `ar`, `zh`)
- ❌ NOT for English (original language)

The notice is displayed as a small, muted, italic text below the hero subtitle.

## RTL Support

Arabic and Hebrew are automatically rendered with RTL (right-to-left) direction:
- `<html dir="rtl">` for Arabic and Hebrew
- `<html dir="ltr">` for all other languages

## Adding New Translations

### Step 1: Add Keys to Messages Interface

In `src/i18n/messages.ts`:

```typescript
export interface SectionMessages {
  heroTitle: string;
  heroSubtitle: string;
  aiTranslatedNotice: string;
  // Add new keys here
  newSectionTitle: string;
  newSectionContent: string;
}
```

### Step 2: Add Translations for All Locales

```typescript
export const messages: Messages = {
  en: {
    heroTitle: '...',
    heroSubtitle: '...',
    aiTranslatedNotice: '...',
    newSectionTitle: 'New Section Title',  // English
    newSectionContent: 'Content...',
  },
  id: {
    heroTitle: '...',
    heroSubtitle: '...',
    aiTranslatedNotice: '...',
    newSectionTitle: 'Judul Bagian Baru',  // Indonesian
    newSectionContent: 'Konten...',
  },
  // ... repeat for all locales
};
```

### Step 3: Use in Components

```typescript
const messages = getMessages(locale);
<h2>{messages.newSectionTitle}</h2>
<p>{messages.newSectionContent}</p>
```

## Per-Section AI Translation Flags (Future)

The structure is prepared for per-section AI translation flags:

```typescript
interface SectionMessages {
  hero: {
    title: string;
    subtitle: string;
    aiTranslated?: boolean;  // Optional flag
  };
  about: {
    title: string;
    content: string;
    aiTranslated?: boolean;
  };
}
```

Currently, all non-English content is considered AI-translated. This can be refined later to mark specific sections.

## Testing

To test the implementation:

1. Navigate to `/en` - Should show English content, NO AI notice
2. Navigate to `/id` - Should show Indonesian content, WITH AI notice
3. Navigate to `/he` - Should show Hebrew content (RTL), WITH AI notice
4. Navigate to `/ar` - Should show Arabic content (RTL), WITH AI notice
5. Navigate to `/zh` - Should show Chinese content, WITH AI notice
6. Navigate to `/` - Should redirect to `/en`
7. Navigate to `/invalid` - Should fall back to `/en` (via locale validation)

## Build & Deployment

The implementation uses Next.js App Router with:
- Static generation for all locale routes
- Server-side locale validation
- Client-side message rendering

All locales are pre-rendered at build time via `generateStaticParams()`.

## Notes

- The hero title automatically highlights "Bali" (and its translations) in the primary color
- RTL languages (Arabic, Hebrew) are automatically handled
- The AI notice is styled as small, muted, italic text
- All translations are stored as static strings in code
- Future: Can be extended to use a translation service or database

