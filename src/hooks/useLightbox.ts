import { useCallback, useEffect, useState } from 'react';

export function useLightbox() {
  const [srcs, setSrcs] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const [closing, setClosing] = useState(false);

  const open = useCallback((nextSrcs: string | string[], startIndex = 0) => {
    setClosing(false);
    const arr = Array.isArray(nextSrcs) ? nextSrcs : [nextSrcs];
    setSrcs(arr);
    setIndex(startIndex < arr.length ? startIndex : 0);
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setSrcs(null);
      setIndex(0);
      setClosing(false);
    }, 200);
  }, []);

  const navigate = useCallback((dir: number) => {
    setIndex((i) => {
      if (!srcs) return i;
      return (i + dir + srcs.length) % srcs.length;
    });
  }, [srcs]);

  useEffect(() => {
    if (!srcs) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [srcs, close, navigate]);

  const src = srcs ? srcs[index] : null;

  return { src, srcs, index, closing, open, close, navigate, isOpen: Boolean(srcs) };
}
