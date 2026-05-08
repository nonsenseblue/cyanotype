import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LanguageProvider, useLang } from './contexts/LanguageContext';
import { Lightbox } from './components/Lightbox';
import { SiteHeader } from './components/SiteHeader';
import { useLightbox } from './hooks/useLightbox';
import issue from './data/issue.json';

function Layout() {
  const location = useLocation();
  const lightbox = useLightbox();
  const { lang } = useLang();

  // pathname → chapter key (or null for home)
  const trimmed = location.pathname.replace(/^\/+|\/+$/g, '');
  const currentKey = trimmed === '' ? null : trimmed.split('/')[0];

  useEffect(() => {
    document.title = 'cyanotype';
  }, [currentKey, lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <>
      <div className="film-frame film-frame-top" aria-hidden="true" />
      <SiteHeader issue={issue} currentKey={currentKey} />
      <Outlet context={{ lightbox }} />
      <div className="film-frame film-frame-bottom" aria-hidden="true" />
      <Lightbox src={lightbox.src} closing={lightbox.closing} onClose={lightbox.close} />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Layout />
    </LanguageProvider>
  );
}
