import { en } from './locales/en';
import { tr } from './locales/tr';
import { de } from './locales/de';
import { fi } from './locales/fi';

export type Language = 'en' | 'tr' | 'de' | 'fi';

export const translations = {
  en,
  tr,
  de,
  fi,
};

export type TranslationKeys = typeof en;

// Helper function to get nested translation
export function getTranslation(
  translations: TranslationKeys,
  key: string
): string {
  const keys = key.split('.');
  let value: unknown = translations;
  
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
    if (value === undefined) return key;
  }
  
  return typeof value === 'string' ? value : key;
}

// Helper function to replace placeholders
export function replacePlaceholders(
  text: string,
  params: Record<string, string | number>
): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

