import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useT } from '../contexts/LanguageContext';
import { photoUrl } from '../lib/photoUrl';
import issue from '../data/issue.json';

function pad2(n) {
  return String(n).padStart(2, '0');
}

export function Viewer({ photos, photoBase, photographer, place, onOpenLightbox }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const reveal = useReveal();
  const thumbsRef = useRef(null);
  const t = useT();
  const ui = issue.ui;

  const current = photos[currentIndex];
  const itemLabel = `No. ${pad2(currentIndex + 1)}`;
  const captionText = t(current.caption);

  useEffect(() => {
    setFading(true);
    const tm = setTimeout(() => setFading(false), 140);
    return () => clearTimeout(tm);
  }, [currentIndex]);

  useEffect(() => {
    const thumbsEl = thumbsRef.current;
    if (!thumbsEl) return;
    const active = thumbsEl.querySelector('.thumb.is-active');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (document.querySelector('.lightbox')) return;
      if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [photos.length]);

  const goPrev = () => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setCurrentIndex((i) => (i + 1) % photos.length);

  const stageSrc = photoUrl(photoBase, 'large', current.file);

  return (
    <section className="viewer" ref={reveal}>

      <div className="viewer-meta">
        <div className="meta-block">
          <div className="meta-label">{t(ui.photos)}</div>
          <div className="meta-value">{photographer}</div>
        </div>
        {place && (
          <div className="meta-block">
            <div className="meta-label">{t(ui.location)}</div>
            <div className="meta-value">{place}</div>
          </div>
        )}
        <div className="meta-block">
          <div className="meta-label">{t(ui.item)}</div>
          <div className="meta-value">{itemLabel}</div>
        </div>
        <div className="meta-block">
          <button type="button" className="pager-link" onClick={goPrev}>{t(ui.previous)}</button>
          <span className="pager-sep">/</span>
          <button type="button" className="pager-link" onClick={goNext}>{t(ui.next)}</button>
        </div>
      </div>

      <figure className="viewer-stage">
        <div className="stage-frame">
          <img
            src={stageSrc}
            alt={captionText}
            className={fading ? 'is-fading' : ''}
            onClick={() => onOpenLightbox(stageSrc)}
          />
        </div>
        <figcaption>{captionText}</figcaption>
      </figure>

      <aside className="viewer-thumbs" ref={thumbsRef}>
        {photos.map((p, i) => (
          <button
            type="button"
            key={p.file}
            className={`thumb${i === currentIndex ? ' is-active' : ''}`}
            onClick={() => setCurrentIndex(i)}
          >
            <img src={photoUrl(photoBase, 'thumbs', p.file)} alt={`No. ${pad2(i + 1)}`} />
            <span className="thumb-label">No. {pad2(i + 1)}</span>
          </button>
        ))}
      </aside>

    </section>
  );
}
