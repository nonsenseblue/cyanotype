import { Link } from 'react-router-dom';
import { Essay } from './Essay';
import { Viewer } from './Viewer';
import { DotsRule } from './DotsRule';
import { Colophon } from './Colophon';
import { HandRule } from './HandRule';
import { ChapterMarks } from './ChapterMarks';
import { useReveal } from '../hooks/useReveal';
import { useT } from '../contexts/LanguageContext';

export function ChapterPage({ chapter, days, issue, nextChapter, onOpenLightbox }) {
  const t = useT();
  const headerRef = useReveal();

  return (
    <article className="chapter-page">

      <header className="chapter-masthead" ref={headerRef}>
        <ChapterMarks chapterKey={chapter.key} />
        <div className="masthead-line">
          <span className="kicker">
            {chapter.volume || issue.volume} — {t(chapter.issueTitle || issue.title)}
          </span>
          <span className="kicker kicker-right">{t(chapter.label)}</span>
        </div>
        <h1 className="chapter-masthead-title">{t(chapter.title)}</h1>
        <p className="chapter-masthead-dateline">
          <span>{t(chapter.place)}</span>
        </p>
        <p className="chapter-masthead-lede">{t(chapter.lede)}</p>
      </header>

      <HandRule />

      {days.length === 0 ? (
        <p className="chapter-coming-soon">{t(issue.ui.comingSoon)}</p>
      ) : (
        <>
          {days.map((day) => (
            <DaySection
              key={day.id}
              day={day}
              showHeader={days.length > 1}
              onOpenLightbox={onOpenLightbox}
            />
          ))}

          <DotsRule />

          <p className="issue-colophon">{t(issue.colophon)}</p>
        </>
      )}

      <ChapterNext nextChapter={nextChapter} ui={issue.ui} />

    </article>
  );
}

function HandArrow({ direction = 'right' }) {
  return (
    <svg
      className={`chapter-next-arrow chapter-next-arrow--${direction}`}
      viewBox="0 0 36 14"
      aria-hidden="true"
    >
      <path
        className="chapter-next-arrow-shaft"
        pathLength="100"
        d="M2,7 C8,5 18,9 32,7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        className="chapter-next-arrow-head"
        pathLength="100"
        d="M26,2 C29,4 31,6 32,7 C31,8 29,10 26,12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChapterNext({ nextChapter, ui }) {
  const t = useT();
  const ref = useReveal();
  if (nextChapter) {
    return (
      <nav className="chapter-next reveal" ref={ref} aria-label="Next chapter">
        <Link to={`/${nextChapter.key}`} className="chapter-next-link">
          <span className="chapter-next-label">{t(ui.nextChapter)}</span>
          <span className="chapter-next-title">
            <span>{t(nextChapter.title)}</span>
            <HandArrow direction="right" />
          </span>
        </Link>
      </nav>
    );
  }
  return (
    <nav className="chapter-next reveal" ref={ref} aria-label="Back to contents">
      <Link to="/" className="chapter-next-link">
        <span className="chapter-next-label">{t(ui.backToContents)}</span>
        <span className="chapter-next-title">
          <HandArrow direction="left" />
          <span>{t(ui.contents)}</span>
        </span>
      </Link>
    </nav>
  );
}

function DaySection({ day, showHeader, onOpenLightbox }) {
  const t = useT();
  const ref = useReveal();
  return (
    <section className="day-section" ref={ref}>

      <DotsRule />

      {showHeader && (
        <header className="day-masthead">
          <div className="day-line">
            <span className="kicker">{day.dayLabel}</span>
          </div>
          <h2 className="day-title">{t(day.title)}</h2>
          <p className="day-dateline">
            <span>{t(day.place)}</span>
            <span className="sep">·</span>
            <span>{day.date}</span>
            {t(day.timeOfDay) && (
              <>
                <span className="sep">·</span>
                <span>{t(day.timeOfDay)}</span>
              </>
            )}
          </p>
        </header>
      )}

      <Essay paragraphs={day.essay} />

      <Viewer
        photos={day.photos}
        photoBase={day.photoBase}
        photographer={day.credits.photographer}
        place={t(day.place)}
        onOpenLightbox={onOpenLightbox}
      />

    </section>
  );
}
