import { useEffect, useRef } from 'react';

export function Lightbox({ src, srcs, closing, onClose, onNavigate }) {
  const containerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swipedRef = useRef(false);

  useEffect(() => {
    if (!src) return;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [src]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e) => { e.preventDefault(); };
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => el.removeEventListener('touchmove', onMove);
  }, [src]);

  if (!src) return null;

  const canNavigate = srcs && srcs.length > 1 && typeof onNavigate === 'function';

  const handleTouchStart = (e) => {
    const t0 = e.touches[0];
    touchStartX.current = t0.clientX;
    touchStartY.current = t0.clientY;
    swipedRef.current = false;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const t1 = e.changedTouches[0];
    const dx = t1.clientX - touchStartX.current;
    const dy = t1.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (canNavigate && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      swipedRef.current = true;
      onNavigate(dx > 0 ? -1 : 1);
    }
  };
  const handleClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className={`lightbox${closing ? ' is-closing' : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img src={src} alt="" />
    </div>
  );
}
