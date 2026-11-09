import type { ArtworkImage } from "../domain";

type IiifImage = Pick<ArtworkImage, "id" | "iiifBaseUrl">;

/** Anchos con caché en el servidor IIIF del museo (843 es el recomendado). */
export const IIIF_WIDTHS = [200, 400, 843, 1686] as const;

/** URL IIIF de la imagen a un ancho exacto, manteniendo la proporción. */
export function buildImageUrl(image: IiifImage, width: number): string {
  if (!Number.isInteger(width) || width <= 0) {
    throw new RangeError(`Ancho de imagen no válido: ${width}`);
  }
  const base = image.iiifBaseUrl.replace(/\/+$/, "");
  return `${base}/${image.id}/full/${width},/0/default.jpg`;
}

/** Valor para el atributo srcset: un candidato por ancho. */
export function buildImageSrcSet(image: IiifImage, widths: readonly number[] = IIIF_WIDTHS) {
  return [...widths]
    .sort((a, b) => a - b)
    .map((width) => `${buildImageUrl(image, width)} ${width}w`)
    .join(", ");
}
