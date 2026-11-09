import Link from "next/link";
import type { ArtworkSummary } from "@galeria/api-client";
import { ArtworkCard, ArtworkImage } from "@galeria/ui";
import { artworkAltText } from "./altText";
import { artworkHref, toImageProps } from "./imageProps";

type ArtworkTileProps = { artwork: ArtworkSummary; priority?: boolean; headingLevel?: 2 | 3 };

/** Une los datos de la obra con los componentes del design system. */
export function ArtworkTile({ artwork, priority = false, headingLevel }: ArtworkTileProps) {
  const media = artwork.image ? (
    <ArtworkImage {...toImageProps(artwork.image, artworkAltText(artwork))} priority={priority} />
  ) : (
    <div className="flex aspect-[4/5] items-center justify-center p-6 text-center text-label text-ink-muted">
      Imagen no disponible
    </div>
  );

  return (
    <ArtworkCard
      href={artworkHref(artwork.id)}
      title={artwork.title}
      artist={artwork.artist}
      date={artwork.date}
      media={media}
      linkComponent={Link}
      headingLevel={headingLevel}
    />
  );
}
