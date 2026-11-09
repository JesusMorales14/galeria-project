import type { ArtworkSummary } from "@galeria/api-client";

type AltSource = Pick<ArtworkSummary, "title" | "artist" | "date"> & {
  image: { altText: string | null } | null;
};

/**
 * Estrategia de texto alternativo:
 * 1. La descripción de la imagen que escribe el museo (alt_text), si existe.
 * 2. Si no, "Título, de Artista, Fecha", omitiendo lo que falte.
 * Ninguna imagen se queda sin alt.
 */
export function artworkAltText(artwork: AltSource): string {
  const museumAlt = artwork.image?.altText?.trim();
  if (museumAlt) return museumAlt;
  return [artwork.title, artwork.artist && `de ${artwork.artist}`, artwork.date]
    .filter(Boolean)
    .join(", ");
}
