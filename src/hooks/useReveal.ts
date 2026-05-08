import { useEffect, useRef } from 'react';

export function useReveal(options = {}) {
  const ref = useRef(null);
  const { threshold = 0.08, rootMargin = '0px 0px -6% 0px' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('reveal');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold, rootMargin });

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
