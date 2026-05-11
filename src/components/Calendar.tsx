import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { useLang, useT } from '../contexts/LanguageContext';

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function monthName(year, month, lang) {
  if (lang === 'jp' || lang === 'cn') return `${year}年${month}月`;
  const d = new Date(year, month - 1, 1);
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function buildMonthGrid(year, month) {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  // Mon=0 .. Sun=6
  const startCol = (first.getDay() + 6) % 7;
  const totalDays = last.getDate();
  const cells = Array(startCol).fill(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function MiniCalendar({ year, month, marks }) {
  const { lang } = useLang();
  const cells = buildMonthGrid(year, month);
  const marksByDay = Object.fromEntries(marks.map((m) => [m.day, m]));

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">{monthName(year, month, lang)}</div>
      <div className="mini-cal-weekdays">
        {WEEKDAY_LABELS.map((w) => (
          <span key={w} className="mini-cal-weekday">{w}</span>
        ))}
      </div>
      <div className="mini-cal-grid">
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="mini-cal-cell mini-cal-cell--empty" />;
          const mark = marksByDay[d];
          if (!mark) return <span key={i} className="mini-cal-cell">{d}</span>;
          return (
            <Link
              key={i}
              to={`/${mark.chapterKey}`}
              className="mini-cal-cell mini-cal-cell--mark"
            >
              <svg
                className="mini-cal-circle"
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
              <span className="mini-cal-day">{d}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function NavArrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 36 14"
      className={`calendar-nav-arrow calendar-nav-arrow--${direction}`}
      aria-hidden="true"
    >
      <path
        d="M2,7 C8,5 18,9 32,7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
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

export function Calendar({ months, label }) {
  const t = useT();
  const ref = useReveal();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setIsPhone(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !isPhone) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w === 0) return;
      const i = Math.round(el.scrollLeft / w);
      setActive(Math.max(0, Math.min(months.length - 1, i)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [isPhone, months.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !isPhone) return;
    let startX = 0;
    let startY = 0;
    let lockedHorizontal = false;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lockedHorizontal = false;
    };
    const onMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!lockedHorizontal && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
        // user is clearly swiping vertically — swallow it so the
        // page itself doesn't scroll while they're inside the carousel.
        e.preventDefault();
      } else if (Math.abs(dx) > Math.abs(dy)) {
        lockedHorizontal = true;
      }
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
    };
  }, [isPhone]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = Math.max(0, Math.min(months.length - 1, i));
    el.scrollTo({ left: el.clientWidth * target, behavior: 'smooth' });
  };

  if (!months || months.length === 0) return null;

  return (
    <section className="calendar reveal" ref={ref} aria-label="Calendar">
      <p className="calendar-heading">{t(label)}</p>
      <div className="calendar-viewport">
        <div className="calendar-grid" ref={scrollerRef}>
          {months.map((m) => (
            <MiniCalendar key={`${m.year}-${m.month}`} {...m} />
          ))}
        </div>
      </div>
      {isPhone && months.length > 1 && (
        <div className="calendar-nav">
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous month"
          >
            <NavArrow direction="left" />
          </button>
          <div className="calendar-nav-dots" aria-hidden="true">
            {months.map((_, i) => (
              <span
                key={i}
                className={`calendar-nav-dot${i === active ? ' is-active' : ''}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="calendar-nav-btn"
            onClick={() => goTo(active + 1)}
            disabled={active === months.length - 1}
            aria-label="Next month"
          >
            <NavArrow direction="right" />
          </button>
        </div>
      )}
    </section>
  );
}
