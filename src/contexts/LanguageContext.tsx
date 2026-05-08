import { createContext, useContext, useEffect, useState } from 'react';

export const LANGUAGES = ['en', 'jp', 'cn'];
const STORAGE_KEY = 'cyanotype-lang';
const DEFAULT_LANG = 'en';

const HTML_LANG = { en: 'en', jp: 'ja', cn: 'zh-Hans' };

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (LANGUAGES.includes(saved)) return saved;
    } catch {}
    return DEFAULT_LANG;
  });

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang] ?? 'en';
  }, [lang]);

  const setLang = (next) => {
    if (!LANGUAGES.includes(next)) return;
    setLangState(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export function useT() {
  const { lang } = useContext(LanguageContext);
  return (field) => {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
      return field[lang] ?? field.en ?? Object.values(field)[0] ?? '';
    }
    return String(field);
  };
}
