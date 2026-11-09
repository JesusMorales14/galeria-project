import type { Artwork } from "@galeria/api-client";
import { ArtworkImage } from "@galeria/ui";
import { artworkAltText, toImageProps } from "@/shared/artwork";

const DETAIL_SIZES = "(min-width: 1024px) 58vw, 100vw";

/** Imagen principal de la obra: es el LCP de la página, así que carga con prioridad. */
export function ArtworkMedia({ artwork }: { artwork: Artwork }) {
  if (!artwork.image) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-placeholder p-8 text-center text-ink-muted">
        El museo no tiene una imagen de esta obra.
      </div>
    );
  }
  const props = toImageProps(artwork.image, artworkAltText(artwork), DETAIL_SIZES);
  return <ArtworkImage {...props} priority className="max-h-[80vh]" />;
}
