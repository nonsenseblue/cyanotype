import { useRef } from 'react';

export function Lightbox({ src, srcs, closing, onClose, onNavigate }) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swipedRef = useRef(false);

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
      className={`lightbox${closing ? ' is-closing' : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img src={src} alt="" />
    </div>
  );
}
