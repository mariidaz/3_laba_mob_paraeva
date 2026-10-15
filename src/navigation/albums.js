export function readAlbumParam(value) {
  if (!value) return null;
  if (typeof value === 'object' && value.id && value.title && value.artist) {
    return { ...value, id: String(value.id) };
  }
  const encoded = Array.isArray(value) ? value[0] : value;
  if (!encoded || typeof encoded !== 'string') return null;
  try {
    const album = JSON.parse(encoded);
    if (!album?.id || !album?.title || !album?.artist) return null;
    return { ...album, id: String(album.id) };
  } catch (_) {
    return null;
  }
}
