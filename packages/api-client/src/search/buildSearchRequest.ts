import { SUMMARY_FIELDS } from "../aic/fields";
import type { SearchQuery, SortOrder } from "../domain";

/** La API no permite paginar más allá de 10.000 resultados. */
export const MAX_RESULT_WINDOW = 10_000;

const SORTS: Record<SortOrder, unknown[] | undefined> = {
  relevance: undefined,
  oldest: [{ date_start: "asc" }],
  newest: [{ date_start: "desc" }],
};

function matchAll(field: string, value: string) {
  return { match: { [field]: { query: value, operator: "and" } } };
}

function buildFilters(query: SearchQuery): unknown[] {
  const filters: unknown[] = [
    { term: { is_public_domain: true } },
    { exists: { field: "image_id" } },
  ];
  if (query.artworkType) filters.push(matchAll("artwork_type_title", query.artworkType));
  if (query.artist) filters.push(matchAll("artist_title", query.artist));
  if (query.dateRange) {
    filters.push({ range: { date_start: { gte: query.dateRange.from, lte: query.dateRange.to } } });
  }
  return filters;
}

/** Desplazamiento de la página, recortado para no salir de la ventana permitida. */
export function pageOffset(page: number, pageSize: number): number {
  const lastAllowed = Math.max(0, MAX_RESULT_WINDOW - pageSize);
  return Math.min((Math.max(1, page) - 1) * pageSize, lastAllowed);
}

/**
 * Traduce nuestra consulta al cuerpo Elasticsearch de la API.
 * Se envía por GET en `params` (JSON), como recomienda la documentación del museo.
 */
export function buildSearchRequest(query: SearchQuery): URLSearchParams {
  const text = query.q?.trim();
  const body = {
    ...(text ? { q: text } : {}),
    query: { bool: { filter: buildFilters(query) } },
    sort: SORTS[query.sort ?? "relevance"],
    from: pageOffset(query.page, query.pageSize),
    size: query.pageSize,
  };
  return new URLSearchParams({
    params: JSON.stringify(body),
    fields: SUMMARY_FIELDS.join(","),
  });
}

export function totalPages(total: number, pageSize: number): number {
  return Math.min(Math.ceil(total / pageSize), Math.floor(MAX_RESULT_WINDOW / pageSize));
}
