import { useReveal } from '../hooks/useReveal';
import { useT } from '../contexts/LanguageContext';

const KIND_CLASS = {
  'lede-first': 'essay-lede',
  'body': 'essay-body',
  'dropline': 'essay-dropline',
};

export function Essay({ paragraphs }) {
  const ref = useReveal();
  const t = useT();
  return (
    <section className="essay" ref={ref}>
      {paragraphs.map((p, i) => (
        <p key={i} className={KIND_CLASS[p.kind] ?? 'essay-body'}>{t(p.text)}</p>
      ))}
    </section>
  );
}
