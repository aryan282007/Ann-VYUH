import { createContext, useContext, useMemo, useState } from 'react';

// Loads every locale/*.json file automatically.
const localeModules = import.meta.glob('../locales/*.json', { eager: true });
const DICTIONARIES = {};
for (const path in localeModules) {
  const code = path.match(/([a-z]+)\.json$/)[1];
  DICTIONARIES[code] = localeModules[path].default ?? localeModules[path];
}

const NATIVE_NAMES = {
  hi: 'हिन्दी',
  en: 'English'
};

export const SUPPORTED_LANGS = Object.keys(DICTIONARIES)
  .filter((code) => NATIVE_NAMES[code])
  .sort((a, b) => (a === 'hi' ? -1 : b === 'hi' ? 1 : NATIVE_NAMES[a].localeCompare(NATIVE_NAMES[b])))
  .map((code) => ({ code, label: NATIVE_NAMES[code] }));

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Default to Hindi
  const [lang, setLangState] = useState(() => localStorage.getItem('siteLang') || 'hi');

  const setLang = (code) => {
    setLangState(code);
    localStorage.setItem('siteLang', code);
  };

  const t = useMemo(() => {
    const dict = DICTIONARIES[lang] || DICTIONARIES.hi;
    return (key, params) => {
      // It's a flat dictionary mapping, e.g. "home.feature.bookSlot.title"
      const template = dict[key] ?? DICTIONARIES.en?.[key] ?? key;
      if (!params) return template;
      return Object.keys(params).reduce(
        (str, k) => str.split(`{${k}}`).join(params[k]),
        template
      );
    };
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
