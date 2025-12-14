/**
 * Email validation utilities for Estate Bali beta waitlist
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  return EMAIL_REGEX.test(trimmed) && trimmed.length <= 254;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
