// Hand-drawn "guardian" marks placed on each chapter masthead.

const PATHS = {
  wave: (
    <path
      d="M3,8 C10,4 18,12 26,8 C34,4 42,12 50,8 C55,5 58,8 57,8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  ),
  bird: (
    <path
      d="M5,16 C10,11 16,11 22,16 C28,11 34,11 40,16 C44,13 48,13 52,16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  ),
  rainbow: (
    <g>
      <path
        d="M4,30 C4,16 16,6 30,6 C44,6 56,16 56,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10,30 C10,18 19,10 30,10 C41,10 50,18 50,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M16,30 C16,21 22,14 30,14 C38,14 44,21 44,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  ),
  skyline: (
    <path
      d="M2,28 L2,20 L6,20 L6,14 L10,14 L10,22 L14,22 L14,8 L18,8 L18,18 L22,18 L22,4 L26,4 L26,16 L30,16 L30,12 L34,12 L34,22 L38,22 L38,6 L42,6 L42,18 L46,18 L46,14 L50,14 L50,24 L54,24 L54,18 L58,18 L58,28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  leaf: (
    <g>
      <path
        d="M30,8 C18,14 12,28 16,46 C30,40 44,28 44,14 C40,11 35,9 30,8 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30,10 L22,42"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  ),
  sun: (
    <g>
      <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M30,4 L30,12 M30,48 L30,56 M4,30 L12,30 M48,30 L56,30 M11,11 L17,17 M43,43 L49,49 M11,49 L17,43 M43,17 L49,11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  ),
  mountain: (
    <path
      d="M3,36 L18,12 L26,22 L34,8 L48,28 L57,36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  moon: (
    <path
      d="M36,8 C26,8 18,16 16,28 C14,40 22,50 34,52 C26,46 22,38 22,30 C22,18 28,10 36,8 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  snowflake: (
    <g>
      <path
        d="M30,6 L30,54 M9,18 L51,42 M9,42 L51,18"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M30,12 L26,16 M30,12 L34,16 M30,48 L26,44 M30,48 L34,44 M14,22 L18,22 M14,22 L16,18 M46,38 L42,38 M46,38 L44,42 M46,22 L42,22 M46,22 L44,18 M14,38 L18,38 M14,38 L16,42"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  ),
  star: (
    <path
      d="M30,8 C32,18 36,22 46,24 C38,30 36,34 38,46 C30,40 26,40 18,46 C20,34 18,30 10,24 C22,22 26,18 30,8 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

const VIEWBOX = {
  wave: '0 0 60 16',
  bird: '0 0 60 30',
  rainbow: '0 0 60 32',
  skyline: '0 0 60 30',
  leaf: '0 0 60 60',
  sun: '0 0 60 60',
  mountain: '0 0 60 40',
  moon: '0 0 60 60',
  snowflake: '0 0 60 60',
  star: '0 0 60 60',
};

const MARKS_BY_CHAPTER = {
  sydney: ['skyline', 'rainbow'],
  queensland: ['leaf', 'sun'],
  boonah: ['mountain', 'moon'],
  yulong: ['snowflake', 'mountain'],
  shangrila: ['sun', 'leaf'],
  meili: ['snowflake', 'star'],
};

function ChapterMark({ kind, side }) {
  return (
    <svg
      className={`chapter-mark chapter-mark--${side} chapter-mark--${kind}`}
      viewBox={VIEWBOX[kind]}
      aria-hidden="true"
    >
      {PATHS[kind]}
    </svg>
  );
}

function TinyStar({ position }) {
  return (
    <svg
      className={`chapter-decor chapter-decor--${position}`}
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
      />
    </svg>
  );
}

export function ChapterMarks({ chapterKey }) {
  const marks = MARKS_BY_CHAPTER[chapterKey];
  if (!marks) return null;
  return (
    <>
      <ChapterMark kind={marks[0]} side="left" />
      <ChapterMark kind={marks[1]} side="right" />
      <TinyStar position="bl" />
      <TinyStar position="br" />
    </>
  );
}
