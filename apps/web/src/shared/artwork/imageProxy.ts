import type { ArtworkImage } from "@galeria/api-client/images";

/**
 * Las imágenes se sirven desde nuestro dominio (/api/iiif), no desde el museo:
 * el servidor IIIF del Art Institute está tras una protección de Cloudflare que
 * responde 403 a los navegadores que piden imágenes desde otra web.
 */
export const IMAGE_PROXY_PATH = "/api/iiif";

/** La misma imagen, pero con las URLs apuntando al proxy propio. */
export function viaProxy<T extends Pick<ArtworkImage, "iiifBaseUrl">>(image: T): T {
  return { ...image, iiifBaseUrl: IMAGE_PROXY_PATH };
}
