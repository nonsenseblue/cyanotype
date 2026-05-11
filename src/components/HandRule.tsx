import { useReveal } from '../hooks/useReveal';

export function HandRule({ variant = '' }) {
  const ref = useReveal();
  return (
    <div
      className={`hand-rule${variant ? ' hand-rule--' + variant : ''}`}
      ref={ref}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 14" preserveAspectRatio="none">
        <path
          pathLength="100"
          d="M3,9 C28,4 52,11 78,7 C104,3 130,11 156,7 C182,3 210,10 237,6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
