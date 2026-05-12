import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCursor } from '../contexts/CursorContext';
import { CURSOR_OPTIONS } from '../components/cursorOptions';

export default function SettingsPage() {
  const { mode, setMode } = useCursor();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const apply = () => setIsTouch(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <article className="page settings-page" lang="en">
      <h1 className="settings-title">Settings</h1>

      <section className="settings-section">
        <h2 className="settings-section-title">Cursor</h2>
        <p className="settings-note">
          {isTouch
            ? 'Cursor styles are only available on desktop pointers.'
            : 'Choose how your pointer appears while reading.'}
        </p>
        <ul className="settings-options">
          {CURSOR_OPTIONS.map((opt) => (
            <li key={opt.mode}>
              <button
                type="button"
                className={`settings-option-btn${mode === opt.mode ? ' is-active' : ''}`}
                onClick={() => setMode(opt.mode)}
                aria-pressed={mode === opt.mode}
                disabled={isTouch && opt.mode !== 'default'}
              >
                <span className="settings-option-icon">{opt.icon}</span>
                <span className="settings-option-label">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Link to="/" className="settings-back">← Back</Link>
    </article>
  );
}
