/**
 * Input sanitization utilities to prevent XSS attacks
 */

/**
 * Sanitize string by removing dangerous HTML/script tags
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';

  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove object and embed tags
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // Trim whitespace
  return sanitized.trim();
}

/**
 * Sanitize HTML by allowing only safe tags
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== 'string') return '';

  // First apply string sanitization
  let sanitized = sanitizeString(input);

  // Remove all HTML tags except for safe ones (p, br, b, i, strong, em, ul, ol, li, a)
  // This is a simple approach - for production, consider using a proper HTML sanitizer library
  const allowedTags = ['p', 'br', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const allowedPattern = allowedTags.join('|');

  // Remove tags that are not in the allowed list
  sanitized = sanitized.replace(/<(?!\/?(?:${allowedPattern})\b)[^>]+>/gi, '');

  return sanitized;
}

/**
 * Escape HTML entities
 */
export function escapeHTML(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize object by sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]);
    } else if (Array.isArray(sanitized[key])) {
      sanitized[key] = sanitized[key].map((item: any) =>
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else if (sanitized[key] && typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';

  // Remove whitespace
  let sanitized = email.trim().toLowerCase();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') return '';

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }

    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize phone number (keep only digits, +, -, spaces, parentheses)
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';

  // Keep only valid phone number characters
  return phone.replace(/[^0-9+\-\s()]/g, '').trim();
}

/**
 * Sanitize number (parse and validate)
 */
export function sanitizeNumber(value: any): number | null {
  if (value === null || value === undefined) return null;

  const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (isNaN(parsed) || !isFinite(parsed)) {
    return null;
  }

  return parsed;
}

/**
 * Sanitize property data specifically
 */
export interface PropertySanitizationOptions {
  title: string;
  description: string;
  address?: string;
  area?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export function sanitizePropertyData(data: PropertySanitizationOptions): PropertySanitizationOptions {
  return {
    title: sanitizeString(data.title),
    description: sanitizeHTML(data.description),
    address: data.address ? sanitizeString(data.address) : undefined,
    area: data.area ? sanitizeString(data.area) : undefined,
    contactName: data.contactName ? sanitizeString(data.contactName) : undefined,
    contactEmail: data.contactEmail ? sanitizeEmail(data.contactEmail) : undefined,
    contactPhone: data.contactPhone ? sanitizePhone(data.contactPhone) : undefined,
  };
}
