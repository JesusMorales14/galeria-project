import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Artwork, ArtworkSummary, SearchQuery, SearchResult } from "@galeria/api-client";
import { aicClient } from "./client";

/*
 * Acceso a datos con caché de Next.js ("use cache").
 * Protege el límite de 60 peticiones/minuto de la API: las respuestas
 * se reutilizan entre visitantes durante el tiempo de cacheLife.
 */

export async function getArtwork(id: number): Promise<Artwork | null> {
  "use cache";
  cacheLife("days"); // una obra casi nunca cambia
  cacheTag(`artwork:${id}`);
  return aicClient.getArtwork(id);
}

export async function getArtworksByIds(ids: readonly number[]): Promise<ArtworkSummary[]> {
  "use cache";
  cacheLife("days");
  return aicClient.getArtworksByIds(ids);
}

export async function searchArtworks(query: SearchQuery): Promise<SearchResult> {
  "use cache";
  cacheLife("hours"); // la búsqueda puede reordenarse con más frecuencia
  return aicClient.searchArtworks(query);
}
