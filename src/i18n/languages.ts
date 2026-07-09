import {
  US,
  CN,
  ES,
  IN,
  SA,
  PT,
  RU,
  JP,
  DE,
  FR,
  KR,
  ID,
  TR,
  IT,
  VN,
  TH,
} from 'country-flag-icons/react/3x2';

export type FlagIcon = typeof US;

export const AUTODETECT = 'auto';

export type Preference = typeof AUTODETECT | string;

export interface Language {
  code: string;
  endonym: string;
  englishName: string;
  country: string;
  Flag: FlagIcon;
  rtl?: boolean;
}

export const LANGUAGES: readonly Language[] = [
  { code: 'en', endonym: 'English', englishName: 'English', country: 'US', Flag: US },
  { code: 'zh', endonym: '中文', englishName: 'Chinese', country: 'CN', Flag: CN },
  { code: 'es', endonym: 'Español', englishName: 'Spanish', country: 'ES', Flag: ES },
  { code: 'hi', endonym: 'हिन्दी', englishName: 'Hindi', country: 'IN', Flag: IN },
  { code: 'ar', endonym: 'العربية', englishName: 'Arabic', country: 'SA', Flag: SA, rtl: true },
  { code: 'pt', endonym: 'Português', englishName: 'Portuguese', country: 'PT', Flag: PT },
  { code: 'ru', endonym: 'Русский', englishName: 'Russian', country: 'RU', Flag: RU },
  { code: 'ja', endonym: '日本語', englishName: 'Japanese', country: 'JP', Flag: JP },
  { code: 'de', endonym: 'Deutsch', englishName: 'German', country: 'DE', Flag: DE },
  { code: 'fr', endonym: 'Français', englishName: 'French', country: 'FR', Flag: FR },
  { code: 'ko', endonym: '한국어', englishName: 'Korean', country: 'KR', Flag: KR },
  { code: 'id', endonym: 'Indonesia', englishName: 'Indonesian', country: 'ID', Flag: ID },
  { code: 'tr', endonym: 'Türkçe', englishName: 'Turkish', country: 'TR', Flag: TR },
  { code: 'it', endonym: 'Italiano', englishName: 'Italian', country: 'IT', Flag: IT },
  { code: 'vi', endonym: 'Tiếng Việt', englishName: 'Vietnamese', country: 'VN', Flag: VN },
  { code: 'th', endonym: 'ไทย', englishName: 'Thai', country: 'TH', Flag: TH },
] as const;

export const LANGUAGE_CODES: readonly string[] = LANGUAGES.map((l) => l.code);

export const DEFAULT_LANGUAGE = 'en';

const SUPPORTED_SET = new Set(LANGUAGE_CODES);

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export function isRtl(code: string): boolean {
  return Boolean(getLanguage(code)?.rtl);
}

const STORAGE_KEY = 'lang';

export function getStoredPreference(): Preference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === AUTODETECT || (v != null && SUPPORTED_SET.has(v))) return v;
  } catch {
    /* localStorage unavailable */
  }
  return AUTODETECT;
}

/** Persist the preference ('auto' or a language code). */
export function setStoredPreference(pref: Preference): void {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* localStorage unavailable */
  }
}

export function resolveLanguageCode(pref: Preference): string {
  if (pref !== AUTODETECT && SUPPORTED_SET.has(pref)) return pref;

  const list =
    typeof navigator !== 'undefined'
      ? navigator.languages?.length
        ? navigator.languages
        : [navigator.language]
      : [];

  for (const tag of list) {
    if (!tag) continue;
    const base = tag.split('-')[0].toLowerCase();
    if (SUPPORTED_SET.has(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}
