import type { ArtworkSummary } from "../domain";
import { normalizeArtworkSummary } from "./normalizeArtwork";
import { rawArtworkSummarySchema } from "./schemas";

/**
 * Valida cada registro por separado: un registro roto se descarta
 * en lugar de tumbar la página entera.
 */
export function parseArtworkList(items: unknown[], iiifBaseUrl: string): ArtworkSummary[] {
  return items.flatMap((item) => {
    const parsed = rawArtworkSummarySchema.safeParse(item);
    return parsed.success ? [normalizeArtworkSummary(parsed.data, iiifBaseUrl)] : [];
  });
}
