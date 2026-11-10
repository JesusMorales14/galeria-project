import { buildImageSrcSet, buildImageUrl, type ArtworkImage } from "@galeria/api-client/images";
import type { ArtworkImageProps } from "@galeria/ui";
import { siteUrl } from "@/shared/config";
import { viaProxy } from "./imageProxy";

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
  const proxied = viaProxy(image);
  return {
    src: buildImageUrl(proxied, DEFAULT_WIDTH),
    srcSet: buildImageSrcSet(proxied, [200, 400, DEFAULT_WIDTH]),
    sizes,
    width: image.width,
    height: image.height,
    alt,
    placeholder: image.lqip,
  };
}

/** URL absoluta de la imagen (vía nuestro proxy) para Open Graph y JSON-LD. */
export function absoluteImageUrl(image: ArtworkImage, width: number = DEFAULT_WIDTH): string {
  return new URL(buildImageUrl(viaProxy(image), width), siteUrl()).href;
}

export const artworkHref = (id: number) => `/obra/${id}`;
