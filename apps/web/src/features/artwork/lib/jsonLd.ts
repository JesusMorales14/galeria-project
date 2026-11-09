import { buildImageUrl, type Artwork } from "@galeria/api-client";

/** Datos estructurados (schema.org/VisualArtwork) para que los buscadores entiendan la obra. */
export function artworkJsonLd(artwork: Artwork, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    url,
    ...(artwork.artist ? { creator: { "@type": "Person", name: artwork.artist } } : {}),
    ...(artwork.dateStart !== null ? { dateCreated: String(artwork.dateStart) } : {}),
    ...(artwork.medium ? { artMedium: artwork.medium } : {}),
    ...(artwork.artworkType ? { artform: artwork.artworkType } : {}),
    ...(artwork.image ? { image: buildImageUrl(artwork.image, 843) } : {}),
    ...(artwork.description ? { description: artwork.description } : {}),
    ...(artwork.isPublicDomain
      ? { license: "https://creativecommons.org/publicdomain/zero/1.0/" }
      : {}),
  };
}

/** Serializa evitando que un "</script>" en los datos cierre la etiqueta. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
