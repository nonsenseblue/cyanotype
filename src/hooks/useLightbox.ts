import { useCallback, useEffect, useState } from 'react';

export function useLightbox() {
  const [src, setSrc] = useState(null);
  const [closing, setClosing] = useState(false);

  const open = useCallback((imageSrc) => {
    setClosing(false);
    setSrc(imageSrc);
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setSrc(null);
      setClosing(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!src) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [src, close]);

  return { src, closing, open, close, isOpen: Boolean(src) };
}
