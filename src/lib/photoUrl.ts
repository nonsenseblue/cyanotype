// Resolve a photo path against the photos host.
// Photos live in a Cloudflare R2 bucket and are served from the bucket's
// public URL (or, later, a custom domain). `photoBase` from the JSON looks
// like "/photos/2026-04-30-sydney-city" — strip the leading "/photos/" and
// join against PHOTOS_BASE so the same roll keys work locally and in prod.
//
// Override at build time with VITE_PHOTOS_BASE for staging / custom domain.

const PHOTOS_BASE = (
  import.meta.env.VITE_PHOTOS_BASE ||
  'https://pub-254dd72be309433595374a307f868203.r2.dev'
).replace(/\/$/, '');

export function photoUrl(photoBase, size, file) {
  const roll = photoBase.replace(/^\/?photos\/?/, '');
  return `${PHOTOS_BASE}/${roll}/${size}/${file}.jpg`;
}
