import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/common.json';
import enProcurexStatic from './locales/en/procurex-static.json';
import sw from './locales/sw/common.json';
import swProcurexStatic from './locales/sw/procurex-static.json';

export const supportedLanguages = ['en', 'sw'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const storedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('procurex.language') : null;
const initialLanguage = supportedLanguages.includes(storedLanguage as SupportedLanguage)
  ? (storedLanguage as SupportedLanguage)
  : 'en';

void i18n.use(initReactI18next).init({
  resources: {
    en: { common: en, procurexStatic: enProcurexStatic },
    sw: { common: sw, procurexStatic: swProcurexStatic }
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false
  }
});

export function persistLanguage(language: SupportedLanguage) {
  window.localStorage.setItem('procurex.language', language);
  document.documentElement.lang = language;
}

document.documentElement.lang = initialLanguage;

export default i18n;
