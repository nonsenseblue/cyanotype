import { useReveal } from '../hooks/useReveal';
import { HandRule } from './HandRule';

function PortraitDecor() {
  return (
    <div className="about-portrait-decor" aria-hidden="true">
      <svg className="portrait-mark portrait-mark--star" viewBox="0 0 24 24">
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
      <svg className="portrait-mark portrait-mark--moon" viewBox="0 0 60 60">
        <path
          d="M36,8 C26,8 18,16 16,28 C14,40 22,50 34,52 C26,46 22,38 22,30 C22,18 28,10 36,8 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg className="portrait-mark portrait-mark--cat" viewBox="0 0 44 36">
        {/* Back-view sitting cat: two triangle ears, rounded body, simple curl tail */}
        <path
          d="M8,34 C8,24 10,18 14,12 L18,18 L22,18 L26,12 C30,18 32,24 32,34 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M32,30 C36,28 38,24 36,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg className="portrait-mark portrait-mark--ministar" viewBox="0 0 24 24">
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
    </div>
  );
}

function HandUnderline() {
  return (
    <svg
      className="about-underline"
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        pathLength="100"
        d="M3,4 C32,1.4 64,6 100,4 C136,2 168,5.4 197,3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function AboutStar({ extraClass = '' }) {
  return (
    <svg
      className={`about-star ${extraClass}`.trim()}
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

function AboutCamera() {
  return (
    <svg
      className="about-camera"
      viewBox="0 0 60 50"
      aria-hidden="true"
    >
      <path
        d="M8,18 L14,18 L18,12 L42,12 L46,18 L52,18 C54,18 56,20 56,22 L56,40 C56,42 54,44 52,44 L8,44 C6,44 4,42 4,40 L4,22 C4,20 6,18 8,18 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="30"
        cy="30"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="30"
        cy="30"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="48"
        cy="22"
        r="1.4"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function About({ about }) {
  const ref = useReveal();

  return (
    <article className="about-page" lang="en">
      <div className="about-portrait-wrap reveal" ref={ref}>
        <figure className="about-portrait">
          <img src="/photos/about/profile.jpg" alt="" />
        </figure>
        <PortraitDecor />
      </div>

      <header className="about-masthead">
        <AboutStar extraClass="about-star--left" />
        <AboutStar extraClass="about-star--right" />
        <h1 className="about-title">About</h1>
        <HandUnderline />
      </header>

      <section className="about-body">
        {about.body.map((p, i) => (
          <p key={i}>{p.en}</p>
        ))}

        <AboutCamera />

        {(about.instagram || about.email) && (
          <ul className="about-contact">
            {about.instagram && (
              <li>
                <a
                  href={`https://instagram.com/${about.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram · @{about.instagram}
                </a>
              </li>
            )}
            {about.email && (
              <li>
                <a href={`mailto:${about.email}`}>{about.email}</a>
              </li>
            )}
          </ul>
        )}
      </section>

      <HandRule variant="bottom" />

      <p className="issue-colophon">cyanotype · 3030</p>
    </article>
  );
}
