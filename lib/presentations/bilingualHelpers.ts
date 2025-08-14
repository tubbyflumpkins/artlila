import { BilingualText } from './types';

export function getText(text: BilingualText, language: 'fr' | 'en'): string {
  if (typeof text === 'string') {
    // If it's just a string, return it (backward compatibility - assumes French)
    return text;
  }
  // If it's an object with language keys, return the appropriate one
  return text[language] || text.fr; // Fallback to French if English not available
}

export function getTextArray(texts: BilingualText[], language: 'fr' | 'en'): string[] {
  return texts.map(text => getText(text, language));
}