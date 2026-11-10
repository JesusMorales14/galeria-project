/** Anchos que sirve el proxy: los del srcset, el de Open Graph y el del zoom. */
export const ALLOWED_WIDTHS = [200, 400, 843, 1686] as const;

const PATTERN = /^([A-Za-z0-9-]{1,64})\/full\/(\d{1,4}),\/0\/default\.jpg$/;

export type IiifRequest = { imageId: string; width: number };

/**
 * Valida la ruta pedida al proxy: solo imágenes IIIF con un ancho permitido.
 * Así el proxy no se puede usar para pedir otra cosa al servidor del museo.
 */
export function parseIiifPath(segments: readonly string[]): IiifRequest | null {
  const match = PATTERN.exec(segments.join("/"));
  if (!match?.[1] || !match[2]) return null;
  const width = Number(match[2]);
  return (ALLOWED_WIDTHS as readonly number[]).includes(width)
    ? { imageId: match[1], width }
    : null;
}
