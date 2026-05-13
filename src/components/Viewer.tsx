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

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swipedRef = useRef(false);

  const handleTouchStart = (e) => {
    const t0 = e.touches[0];
    touchStartX.current = t0.clientX;
    touchStartY.current = t0.clientY;
    swipedRef.current = false;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const t1 = e.changedTouches[0];
    const dx = t1.clientX - touchStartX.current;
    const dy = t1.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      swipedRef.current = true;
      if (dx > 0) goPrev();
      else goNext();
    }
  };
  const handleStageClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    const allSrcs = photos.map((p) => photoUrl(photoBase, 'large', p.file));
    onOpenLightbox(allSrcs, currentIndex);
  };

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
        <div
          className="stage-frame"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={stageSrc}
            alt={captionText}
            className={fading ? 'is-fading' : ''}
            onClick={handleStageClick}
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
