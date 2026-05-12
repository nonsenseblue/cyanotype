import { createContext, useContext, useEffect, useState } from 'react';

export const CURSOR_MODES = ['default', 'reticle', 'aperture', 'shutter', 'iso'];
const STORAGE_KEY = 'cyanotype-cursor';
const DEFAULT_MODE = 'default';

const CursorContext = createContext({
  mode: DEFAULT_MODE,
  setMode: () => {},
});

export function CursorProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (CURSOR_MODES.includes(saved)) return saved;
    } catch {}
    return DEFAULT_MODE;
  });

  useEffect(() => {
    document.body.dataset.cursor = mode;
    return () => {
      delete document.body.dataset.cursor;
    };
  }, [mode]);

  const setMode = (next) => {
    if (!CURSOR_MODES.includes(next)) return;
    setModeState(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch {}
  };

  return (
    <CursorContext.Provider value={{ mode, setMode }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
