import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { useT } from '../contexts/LanguageContext';
import { HandRule } from './HandRule';
import { Calendar } from './Calendar';
import { photoUrl } from '../lib/photoUrl';

function ChapterCard({ chapter }) {
  const t = useT();
  const ref = useReveal();
  const cover = chapter.covers[0];
  return (
    <li className="chapter-card reveal" ref={ref}>
      <Link to={`/${chapter.key}`} className="chapter-card-link">
        <div className="chapter-card-cover">
          <img
            src={photoUrl(cover.photoBase, 'thumbs', cover.file)}
            alt=""
            loading="lazy"
          />
        </div>
        <div className="chapter-card-meta">
          <p className="chapter-card-label">{t(chapter.label)}</p>
          <h3 className="chapter-card-title">{t(chapter.title)}</h3>
          <p className="chapter-card-place">{t(chapter.place)}</p>
          <p className="chapter-card-lede">{t(chapter.lede)}</p>
        </div>
      </Link>
    </li>
  );
}

export function Index({ issue }) {
  const t = useT();
  const heroRef = useReveal();
  const sectionRef = useReveal();

  return (
    <article className="home">

      <section className="hero" ref={heroRef}>
        <div className="hero-decor" aria-hidden="true">
          <svg className="hero-mark hero-mark-2" viewBox="0 0 60 60">
            <path
              d="M30,8 C32,18 36,22 46,24 C38,30 36,34 38,46 C30,40 26,40 18,46 C20,34 18,30 10,24 C22,22 26,18 30,8 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <svg className="hero-mark hero-mark-3" viewBox="0 0 60 60">
            <path
              d="M30,10 C32,18 35,21 44,23 C37,28 35,32 37,42 C30,38 26,38 19,42 C21,32 19,28 12,23 C21,21 24,18 26,10 C27,8 29,8 30,10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <svg className="hero-mark hero-mark-4" viewBox="0 0 60 60">
            <path
              d="M36,8 C26,8 18,16 16,28 C14,40 22,50 34,52 C26,46 22,38 22,30 C22,18 28,10 36,8 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <svg className="hero-mark hero-mark-5" viewBox="0 0 60 50">
            <path
              d="M8,18 L14,18 L18,12 L42,12 L46,18 L52,18 C54,18 56,20 56,22 L56,40 C56,42 54,44 52,44 L8,44 C6,44 4,42 4,40 L4,22 C4,20 6,18 8,18 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle
              cx="30"
              cy="30"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle
              cx="30"
              cy="30"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="48"
              cy="22"
              r="1.4"
              fill="currentColor"
              stroke="none"
            />
          </svg>

          <svg className="hero-mark hero-mark-6" viewBox="0 0 60 60">
            <path
              d="M30,14 C31,22 33,24 40,26 C33,28 31,30 30,38 C29,30 27,28 20,26 C27,24 29,22 30,14 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="hero-tagline">{t(issue.tagline)}</h1>
        {issue.intro && (
          <p className="hero-intro">{t(issue.intro)}</p>
        )}
      </section>

      <HandRule variant="top" />

      <Calendar months={issue.calendar} label={issue.ui.calendar} />

      <HandRule />

      <section className="vol-section" ref={sectionRef}>
        <header className="vol-section-header">
          <p className="vol-section-volume">{issue.volume}</p>
          <h2 className="vol-section-title">{t(issue.title)}</h2>
          <p className="vol-section-subtitle">{t(issue.subtitle)}</p>
        </header>

        <ul className="chapter-grid">
          {issue.chapters
            .filter((c) => !c.placeholder)
            .map((c) => (
              <ChapterCard key={c.key} chapter={c} />
            ))}
        </ul>
      </section>

      <HandRule variant="bottom" />

      <p className="issue-colophon">{t(issue.homeColophon)}</p>

    </article>
  );
}
