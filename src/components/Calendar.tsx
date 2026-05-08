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

export function Calendar({ months, label }) {
  const t = useT();
  const ref = useReveal();
  if (!months || months.length === 0) return null;
  return (
    <section className="calendar reveal" ref={ref} aria-label="Calendar">
      <p className="calendar-heading">{t(label)}</p>
      <div className="calendar-grid">
        {months.map((m) => (
          <MiniCalendar key={`${m.year}-${m.month}`} {...m} />
        ))}
      </div>
    </section>
  );
}
