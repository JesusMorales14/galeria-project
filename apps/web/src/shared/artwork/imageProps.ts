import { buildImageSrcSet, buildImageUrl, type ArtworkImage } from "@galeria/api-client";
import type { ArtworkImageProps } from "@galeria/ui";

/** Ancho recomendado por el museo (lo tiene en caché). */
export const DEFAULT_WIDTH = 843;

/** Tamaño que ocupa una miniatura en la cuadrícula, para que el navegador elija bien. */
export const GRID_SIZES =
  "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw";

export function toImageProps(
  image: ArtworkImage,
  alt: string,
  sizes: string = GRID_SIZES,
): ArtworkImageProps {
  return {
    src: buildImageUrl(image, DEFAULT_WIDTH),
    srcSet: buildImageSrcSet(image, [200, 400, DEFAULT_WIDTH]),
    sizes,
    width: image.width,
    height: image.height,
    alt,
    placeholder: image.lqip,
  };
}

export const artworkHref = (id: number) => `/obra/${id}`;
