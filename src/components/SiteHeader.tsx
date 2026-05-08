import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang, useT, LANGUAGES } from '../contexts/LanguageContext';

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

        <LangSwitcher extraClass="site-lang--desktop" />

        <button
          type="button"
          className={`site-burger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? t(issue.ui.close) : t(issue.ui.menu)}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

      </div>

      {menuOpen && (
        <nav className="site-drawer" aria-label="Menu">
          <Link
            to="/"
            className={`site-drawer-link${currentKey === null ? ' is-current' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {t(issue.ui.contents)}
          </Link>
          {issue.chapters
            .filter((c) => !c.placeholder)
            .map((c) => (
              <Link
                key={c.key}
                to={`/${c.key}`}
                className={`site-drawer-link${currentKey === c.key ? ' is-current' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {t(c.title)}
              </Link>
            ))}
          <LangSwitcher extraClass="site-lang--drawer" />
        </nav>
      )}

    </header>
  );
}
