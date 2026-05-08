// Resolve a photo path against the current base URL.
// dev:  BASE_URL = "/"          → "/photos/foo/thumbs/01.jpg"
// prod: BASE_URL = "/cyanotype/" → "/cyanotype/photos/foo/thumbs/01.jpg"
//
// `photoBase` from the JSON looks like "/photos/2026-04-30-sydney-city".

const BASE = import.meta.env.BASE_URL;

export function photoUrl(photoBase, size, file) {
  const trimmed = photoBase.replace(/^\/+/, '');
  return BASE + trimmed + '/' + size + '/' + file + '.jpg';
}
