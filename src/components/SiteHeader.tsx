import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang, useT, LANGUAGES } from '../contexts/LanguageContext';

function DrawerStar() {
  return (
    <svg
      className="drawer-divider-star"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12,4 C13,9 14,10 18,11 C14,12 13,13 12,18 C11,13 10,12 6,11 C10,10 11,9 12,4 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function LangSwitcher({ extraClass = '' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`site-lang ${extraClass}`.trim()}>
      {LANGUAGES.map((l, i) => (
        <span key={l} className="site-lang-item">
          {i > 0 && <span className="site-lang-sep" aria-hidden="true">·</span>}
          <button
            type="button"
            className={`site-lang-btn${lang === l ? ' is-current' : ''}`}
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
          >
            <svg
              className="site-lang-circle"
              viewBox="0 0 80 60"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                pathLength="100"
                d="M16,30 C10,16 26,6 42,7 C61,8 76,17 73,32 C70,47 51,55 33,51 C16,47 5,42 16,30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="site-lang-label">{l.toUpperCase()}</span>
          </button>
        </span>
      ))}
    </div>
  );
}

export function SiteHeader({ issue, currentKey }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useT();
  const location = useLocation();

  // close drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header-inner">

        <Link to="/" className="site-brand">{issue.brand}</Link>

        <Link
          to="/about"
          className={`site-about-link${currentKey === 'about' ? ' is-current' : ''}`}
        >
          <svg
            className="site-about-circle"
            viewBox="0 0 80 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              pathLength="100"
              d="M16,30 C10,16 26,6 42,7 C61,8 76,17 73,32 C70,47 51,55 33,51 C16,47 5,42 16,30 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="site-about-label">About</span>
        </Link>

        <LangSwitcher extraClass="site-lang--desktop" />

        <button
          type="button"
          className={`site-burger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close' : 'Menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

      </div>

      {menuOpen && (
        <>
          <div
            className="site-drawer-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav className="site-drawer" aria-label="Menu">
            <Link
              to="/"
              className={`drawer-link drawer-link--home${currentKey === null ? ' is-current' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Contents
            </Link>

            {issue.volumes.map((vol) => {
              const volChapters = issue.chapters.filter(
                (c) => !c.placeholder && c.volume === vol.volume,
              );
              if (volChapters.length === 0) return null;
              return (
                <section className="drawer-vol" key={vol.volume}>
                  <p className="drawer-vol-label">
                    {vol.volume} — {t(vol.title)}
                  </p>
                  {volChapters.map((c) => (
                    <Link
                      key={c.key}
                      to={`/${c.key}`}
                      className={`drawer-link${currentKey === c.key ? ' is-current' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {t(c.title)}
                    </Link>
                  ))}
                </section>
              );
            })}

            <div className="drawer-footer">
              <Link
                to="/about"
                className={`drawer-link drawer-link--about${currentKey === 'about' ? ' is-current' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <DrawerStar />
              <LangSwitcher extraClass="site-lang--drawer" />
            </div>
          </nav>
        </>
      )}

    </header>
  );
}
