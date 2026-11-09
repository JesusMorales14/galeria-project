import type { Metadata } from "next";
import { buildImageUrl, type Artwork } from "@galeria/api-client";
import { artworkCaption, artworkName, truncate } from "./label";

const OG_WIDTH = 843;

function ogImage(artwork: Artwork) {
  const { image } = artwork;
  if (!image) return undefined;
  const height =
    image.width && image.height ? Math.round((OG_WIDTH * image.height) / image.width) : undefined;
  return [
    { url: buildImageUrl(image, OG_WIDTH), width: OG_WIDTH, height, alt: artworkName(artwork) },
  ];
}

/** Título, descripción e imagen para buscadores y para compartir en LinkedIn o WhatsApp. */
export function artworkMetadata(artwork: Artwork): Metadata {
  const title = artworkName(artwork);
  const description = truncate(artwork.description ?? artworkCaption(artwork), 160);
  const images = ogImage(artwork);
  return {
    title,
    description,
    alternates: { canonical: `/obra/${artwork.id}` },
    openGraph: { type: "article", title, description, ...(images ? { images } : {}) },
    twitter: { card: images ? "summary_large_image" : "summary", title, description },
  };
}
