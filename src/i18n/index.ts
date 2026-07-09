import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_LANGUAGE,
  getStoredPreference,
  isRtl,
  resolveLanguageCode,
} from './languages';

import en from './locales/en.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import hi from './locales/hi.json';
import ar from './locales/ar.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import ja from './locales/ja.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import ko from './locales/ko.json';
import id from './locales/id.json';
import tr from './locales/tr.json';
import it from './locales/it.json';
import vi from './locales/vi.json';
import th from './locales/th.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  es: { translation: es },
  hi: { translation: hi },
  ar: { translation: ar },
  pt: { translation: pt },
  ru: { translation: ru },
  ja: { translation: ja },
  de: { translation: de },
  fr: { translation: fr },
  ko: { translation: ko },
  id: { translation: id },
  tr: { translation: tr },
  it: { translation: it },
  vi: { translation: vi },
  th: { translation: th },
};

function syncDocumentLanguage(language: string) {
  const base = language.split('-')[0];
  document.documentElement.lang = base;
  document.documentElement.dir = isRtl(base) ? 'rtl' : 'ltr';
}

void i18n.use(initReactI18next).init({
  resources,
  fallbackLng: DEFAULT_LANGUAGE,
  load: 'languageOnly',
  nonExplicitSupportedLngs: true,
  lng: resolveLanguageCode(getStoredPreference()),
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true,
});

syncDocumentLanguage(i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
