import { useT } from '../contexts/LanguageContext';
import issue from '../data/issue.json';

export function Colophon({ film, camera, developed }) {
  const t = useT();
  return (
    <footer className="colophon">
      <span>{film}</span>
      <span className="sep">—</span>
      <span>{camera}</span>
      <span className="sep">—</span>
      <span>{t(issue.ui.developed)} {developed}</span>
    </footer>
  );
}
