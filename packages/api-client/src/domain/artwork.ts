/**
 * Tipos propios de Galería. La interfaz depende de estos tipos,
 * nunca del formato original de la API del museo.
 */
export type ArtworkImage = {
  id: string;
  iiifBaseUrl: string;
  width: number | null;
  height: number | null;
  /** Placeholder diminuto en base64 que manda el museo. */
  lqip: string | null;
  altText: string | null;
};

export type ArtworkSummary = {
  id: number;
  title: string;
  artist: string | null;
  date: string | null;
  artworkType: string | null;
  image: ArtworkImage | null;
};

export type Artwork = ArtworkSummary & {
  artistDisplay: string | null;
  dateStart: number | null;
  dateEnd: number | null;
  medium: string | null;
  dimensions: string | null;
  placeOfOrigin: string | null;
  description: string | null;
  creditLine: string | null;
  department: string | null;
  style: string | null;
  isPublicDomain: boolean;
};
