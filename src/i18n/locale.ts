export type Locale = 'en' | 'fr';

const STORAGE_KEY = 'externalize-locale-v1';

export function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'fr') {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return 'en';
}

export function saveLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEY, locale);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'fr' : 'en';
}
