import type { Artwork } from "@galeria/api-client";

/** "Título, de Artista": el nombre con el que se comparte una obra. */
export function artworkName(artwork: Pick<Artwork, "title" | "artist">): string {
  return artwork.artist ? `${artwork.title}, de ${artwork.artist}` : artwork.title;
}

/** Cartela breve: "Artista, fecha. Técnica." */
export function artworkCaption(artwork: Pick<Artwork, "artist" | "date" | "medium">): string {
  const who = [artwork.artist ?? "Artista desconocido", artwork.date].filter(Boolean).join(", ");
  return artwork.medium ? `${who}. ${artwork.medium}.` : `${who}.`;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
