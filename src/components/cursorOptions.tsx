export const CURSOR_OPTIONS = [
  {
    mode: 'default',
    label: 'Default',
    icon: (
      <svg viewBox="0 0 40 40">
        <path
          d="M12,6 L12,30 L17,25 L21,33 L24,32 L20,24 L27,24 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    mode: 'reticle',
    label: 'Reticle',
    icon: (
      <svg viewBox="0 0 40 40">
        <line x1="20" y1="4" x2="20" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="20" y1="25" x2="20" y2="36" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="4" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="25" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="20" cy="20" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    mode: 'aperture',
    label: 'Aperture',
    icon: (
      <svg viewBox="0 0 40 40">
        <defs>
          <radialGradient id="cyanotypeOptionHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff1c4" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#ffd98a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffc566" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="19" fill="url(#cyanotypeOptionHalo)" />
        <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="20" cy="20" r="3.6" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="20" cy="20" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    mode: 'shutter',
    label: 'Shutter',
    icon: (
      <svg viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="20" cy="20" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="20" cy="20" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    mode: 'iso',
    label: 'ISO',
    icon: (
      <svg viewBox="0 0 40 40">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = 20 + Math.cos(angle) * 13;
          const y = 20 + Math.sin(angle) * 13;
          return <circle key={i} cx={x} cy={y} r="0.85" fill="currentColor" />;
        })}
        <circle cx="20" cy="20" r="1" fill="currentColor" />
      </svg>
    ),
  },
];
