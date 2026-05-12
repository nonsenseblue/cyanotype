import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../contexts/CursorContext';
import { CURSOR_OPTIONS } from './cursorOptions';

const INTRO_DURATION = 2400;
const CLOSING_DURATION = 700;

function OpeningReticle() {
  return (
    <svg viewBox="0 0 40 40" className="opening-reticle-svg" aria-hidden="true">
      <rect x="13" y="13" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      <line x1="20" y1="6" x2="20" y2="14" stroke="currentColor" strokeWidth="0.5" />
      <line x1="20" y1="26" x2="20" y2="34" stroke="currentColor" strokeWidth="0.5" />
      <line x1="6" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="0.5" />
      <line x1="26" y1="20" x2="34" y2="20" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="20" cy="20" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function OpeningSequence() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState('intro');
  const [isTouch, setIsTouch] = useState(false);
  const { setMode } = useCursor();
  const closedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouch(mq.matches);
    setShow(true);
    document.body.classList.add('opening-active');
    return () => {
      document.body.classList.remove('opening-active');
    };
  }, []);

  useEffect(() => {
    if (!show || phase !== 'intro') return;
    const t = setTimeout(() => {
      if (closedRef.current) return;
      setPhase(isTouch ? 'closing' : 'select');
    }, INTRO_DURATION);
    return () => clearTimeout(t);
  }, [show, phase, isTouch]);

  useEffect(() => {
    if (phase !== 'closing') return;
    closedRef.current = true;
    document.body.classList.remove('opening-active');
    const t = setTimeout(() => setShow(false), CLOSING_DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  const handleSelect = (next) => {
    setMode(next);
    setPhase('closing');
  };
  const handleSkip = () => {
    setPhase('closing');
  };

  if (!show) return null;

  return (
    <div className={`opening-sequence opening-sequence--${phase}`} role="dialog" aria-label="cyanotype intro">
      <div className="opening-stage">
        <div className="opening-viewfinder" aria-hidden="true">
          <span className="opening-corner opening-corner--tl" />
          <span className="opening-corner opening-corner--tr" />
          <span className="opening-corner opening-corner--bl" />
          <span className="opening-corner opening-corner--br" />

          <div className="opening-grid" aria-hidden="true">
            <span className="opening-grid-line opening-grid-v opening-grid-v--1" />
            <span className="opening-grid-line opening-grid-v opening-grid-v--2" />
            <span className="opening-grid-line opening-grid-h opening-grid-h--1" />
            <span className="opening-grid-line opening-grid-h opening-grid-h--2" />
          </div>

          <div className="opening-meta opening-meta--tl">
            <span className="opening-meta-item">M</span>
            <span className="opening-meta-item">AF-S</span>
            <span className="opening-meta-item">S</span>
          </div>
          <div className="opening-meta opening-meta--tc">
            <span className="opening-meta-item">AWB</span>
            <span className="opening-meta-item opening-meta-item--soft">5500K</span>
          </div>
          <div className="opening-meta opening-meta--tr">
            <span className="opening-meta-item">24 / 36</span>
            <span className="opening-batt" aria-hidden="true">
              <svg viewBox="0 0 18 9" className="opening-batt-svg">
                <rect x="0.5" y="0.5" width="14" height="8" fill="none" stroke="currentColor" strokeWidth="0.6" />
                <rect x="15" y="2.5" width="1.6" height="4" fill="currentColor" />
                <rect x="1.6" y="1.6" width="10" height="5.8" fill="currentColor" opacity="0.65" />
              </svg>
            </span>
          </div>

          <span className="opening-reticle-wrap">
            <OpeningReticle />
          </span>

          <p className="opening-tagline">We live in a handful of moments.</p>

          <div className="opening-meta opening-meta--bl">
            <span className="opening-meta-item opening-meta-item--bold">ƒ / 2.0</span>
          </div>
          <div className="opening-meter" aria-hidden="true">
            <span className="opening-meter-label">−2</span>
            <span className="opening-meter-tick" />
            <span className="opening-meter-tick" />
            <span className="opening-meter-tick opening-meter-tick--center" />
            <span className="opening-meter-tick" />
            <span className="opening-meter-tick" />
            <span className="opening-meter-label">+2</span>
            <span className="opening-meter-bar" />
            <span className="opening-meter-needle" />
          </div>
          <div className="opening-meta opening-meta--br">
            <span className="opening-meta-item opening-meta-item--bold">1 / 125</span>
          </div>

          <p className="opening-exposure">35mm  ·  ISO 400  ·  ±0.0</p>
        </div>
        {phase === 'select' && !isTouch && (
          <div className="opening-cursor-panel">
            <p className="opening-cursor-prompt">Choose your pointer</p>
            <ul className="opening-cursor-options">
              {CURSOR_OPTIONS.map((opt) => (
                <li key={opt.mode}>
                  <button
                    type="button"
                    className="opening-cursor-btn"
                    onClick={() => handleSelect(opt.mode)}
                  >
                    <span className="opening-cursor-icon">{opt.icon}</span>
                    <span className="opening-cursor-label">{opt.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button type="button" className="opening-skip" onClick={handleSkip}>
        Skip
      </button>
    </div>
  );
}
