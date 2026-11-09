import type { Artwork, SearchQuery } from "@galeria/api-client";

/** Se piden 5 para poder descartar la obra actual y mostrar 4. */
export const RELATED_COUNT = 4;

/** Obras relacionadas: del mismo artista; si no se conoce, del mismo tipo. */
export function relatedQuery(artwork: Pick<Artwork, "artist" | "artworkType">): SearchQuery | null {
  const base = { page: 1, pageSize: RELATED_COUNT + 1 };
  if (artwork.artist) return { ...base, artist: artwork.artist };
  if (artwork.artworkType) return { ...base, artworkType: artwork.artworkType };
  return null;
}
