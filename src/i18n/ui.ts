import en from './translations/en.json';
import ru from './translations/ru.json';

const translations = { en, ru } as const;

export type Locale = keyof typeof translations;
export const defaultLocale: Locale = 'en';
export const locales = Object.keys(translations) as Locale[];

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Locale;
  return defaultLocale;
}

export function t(locale: Locale, key: string): string {
  return (translations[locale] as Record<string, string>)[key]
    ?? (translations[defaultLocale] as Record<string, string>)[key]
    ?? key;
}

export function getLocalizedPath(locale: Locale, path: string = '/'): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ru' : 'en';
}
