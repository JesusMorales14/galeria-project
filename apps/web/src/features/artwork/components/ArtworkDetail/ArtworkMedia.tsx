import type { Artwork } from "@galeria/api-client";
import { buildImageSrcSet, buildImageUrl } from "@galeria/api-client/images";
import { ZoomViewer } from "@galeria/ui";
import { artworkAltText, DEFAULT_WIDTH, preconnectToImages } from "@/shared/artwork";

/**
 * Imagen principal con visor de zoom. Es el LCP de la página: se pide con prioridad.
 * Al acercar, el visor amplía `sizes` y el navegador pide la versión de 1686 px
 * (recomendada por el museo para obras de dominio público cuando hay una necesidad clara).
 */
export function ArtworkMedia({ artwork }: { artwork: Artwork }) {
  if (!artwork.image) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-placeholder p-8 text-center text-ink-muted">
        El museo no tiene una imagen de esta obra.
      </div>
    );
  }
  preconnectToImages(artwork.image);
  return (
    <ZoomViewer
      src={buildImageUrl(artwork.image, DEFAULT_WIDTH)}
      srcSet={buildImageSrcSet(artwork.image, [DEFAULT_WIDTH, 1686])}
      width={artwork.image.width}
      height={artwork.image.height}
      alt={artworkAltText(artwork)}
      title={artwork.title}
      placeholder={artwork.image.lqip}
    />
  );
}
