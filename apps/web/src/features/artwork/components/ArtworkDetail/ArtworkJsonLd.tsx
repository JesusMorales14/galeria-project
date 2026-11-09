import type { Artwork } from "@galeria/api-client";
import { siteUrl } from "@/shared/config";
import { artworkJsonLd, serializeJsonLd } from "../../lib/jsonLd";

export function ArtworkJsonLd({ artwork }: { artwork: Artwork }) {
  const url = new URL(`/obra/${artwork.id}`, siteUrl()).href;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(artworkJsonLd(artwork, url)) }}
    />
  );
}
