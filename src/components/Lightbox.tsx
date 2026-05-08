export function Lightbox({ src, closing, onClose }) {
  if (!src) return null;
  return (
    <div
      className={`lightbox${closing ? ' is-closing' : ''}`}
      onClick={onClose}
    >
      <img src={src} alt="" />
    </div>
  );
}
