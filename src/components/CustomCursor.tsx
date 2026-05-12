import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../contexts/CursorContext';

const HOVER_SELECTOR = 'a, button, img, [role="button"], .photo-card, .calendar-card-photo';

function ApertureSVG() {
  return (
    <svg viewBox="0 0 40 40" className="custom-cursor-svg">
      <defs>
        <radialGradient id="cyanotypeCursorHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff1c4" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#ffd98a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffc566" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="url(#cyanotypeCursorHalo)" className="aperture-halo" />
      <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="0.9" className="aperture-barrel" />
      <circle cx="20" cy="20" r="3.6" fill="none" stroke="currentColor" strokeWidth="0.75" className="aperture-hole" />
      <circle cx="20" cy="20" r="0.9" fill="currentColor" />
    </svg>
  );
}

function ReticleSVG() {
  return (
    <svg viewBox="0 0 40 40" className="custom-cursor-svg">
      <line x1="20" y1="4" x2="20" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="20" y1="25" x2="20" y2="36" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="4" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="25" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="20" cy="20" r="0.9" fill="currentColor" />
    </svg>
  );
}

function ShutterSVG() {
  return (
    <svg viewBox="0 0 40 40" className="custom-cursor-svg">
      <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="0.9" className="shutter-rim" />
      <circle cx="20" cy="20" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.9" className="shutter-button" />
      <circle cx="20" cy="20" r="1.4" fill="currentColor" className="shutter-press" />
    </svg>
  );
}

function ISOSVG() {
  // 12 outer dots on a ring + 8 inner dots that appear on hover (high-ISO grain)
  const outer = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return [20 + Math.cos(angle) * 13, 20 + Math.sin(angle) * 13];
  });
  const inner = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return [20 + Math.cos(angle) * 7, 20 + Math.sin(angle) * 7];
  });
  return (
    <svg viewBox="0 0 40 40" className="custom-cursor-svg">
      <g className="iso-ring-outer">
        {outer.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.85" fill="currentColor" />
        ))}
      </g>
      <g className="iso-ring-inner">
        {inner.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.7" fill="currentColor" />
        ))}
      </g>
      <circle cx="20" cy="20" r="0.85" fill="currentColor" />
    </svg>
  );
}

const RENDERERS = {
  reticle: ReticleSVG,
  aperture: ApertureSVG,
  shutter: ShutterSVG,
  iso: ISOSVG,
};

export function CustomCursor() {
  const { mode } = useCursor();
  const cursorRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const apply = () => setEnabled(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!enabled || mode === 'default') {
      setVisible(false);
      setHover(false);
      return;
    }

    const onMove = (e) => {
      const el = cursorRef.current;
      if (!el) return;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      if (!visible) setVisible(true);
    };
    const onOver = (e) => {
      const t = e.target;
      if (t && typeof t.closest === 'function' && t.closest(HOVER_SELECTOR)) {
        setHover(true);
      }
    };
    const onOut = (e) => {
      const r = e.relatedTarget;
      if (!r || typeof r.closest !== 'function' || !r.closest(HOVER_SELECTOR)) {
        setHover(false);
      }
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled, mode, visible]);

  if (!enabled || mode === 'default') return null;

  const Renderer = RENDERERS[mode];
  if (!Renderer) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor custom-cursor--${mode}${hover ? ' is-hover' : ''}${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <Renderer />
    </div>
  );
}
