import type { Artwork, ArtworkImage, ArtworkSummary } from "../domain";
import { htmlToText } from "../text/htmlToText";
import type { RawArtwork, RawArtworkSummary } from "./schemas";

function normalizeImage(raw: RawArtworkSummary, iiifBaseUrl: string): ArtworkImage | null {
  if (!raw.image_id) return null;
  return {
    id: raw.image_id,
    iiifBaseUrl,
    width: raw.thumbnail?.width ?? null,
    height: raw.thumbnail?.height ?? null,
    lqip: raw.thumbnail?.lqip ?? null,
    altText: raw.thumbnail?.alt_text ?? null,
  };
}

export function normalizeArtworkSummary(
  raw: RawArtworkSummary,
  iiifBaseUrl: string,
): ArtworkSummary {
  return {
    id: raw.id,
    title: raw.title,
    artist: raw.artist_title,
    date: raw.date_display,
    artworkType: raw.artwork_type_title,
    image: normalizeImage(raw, iiifBaseUrl),
  };
}

export function normalizeArtwork(raw: RawArtwork, iiifBaseUrl: string): Artwork {
  return {
    ...normalizeArtworkSummary(raw, iiifBaseUrl),
    artistDisplay: raw.artist_display,
    dateStart: raw.date_start,
    dateEnd: raw.date_end,
    medium: raw.medium_display,
    dimensions: raw.dimensions,
    placeOfOrigin: raw.place_of_origin,
    description: htmlToText(raw.description) ?? htmlToText(raw.short_description),
    creditLine: raw.credit_line,
    department: raw.department_title,
    style: raw.style_title,
    isPublicDomain: raw.is_public_domain,
  };
}
