import type { SearchQuery } from "@galeria/api-client";

/**
 * Contexto de una búsqueda para adjuntar a los errores: qué filtros estaban activos,
 * sin el texto que escribió el usuario (solo si había texto).
 */
export function searchErrorContext(query: SearchQuery) {
  return {
    tipo: query.artworkType ?? null,
    epoca: query.dateRange ? `${query.dateRange.from}-${query.dateRange.to}` : null,
    orden: query.sort ?? "relevance",
    pagina: query.page,
    conTexto: Boolean(query.q),
    conArtista: Boolean(query.artist),
  };
}
