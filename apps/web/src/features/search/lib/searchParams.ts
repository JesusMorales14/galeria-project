import { z } from "zod";
import { MAX_RESULT_WINDOW, type SearchQuery, type SortOrder } from "@galeria/api-client";
import { ARTWORK_TYPES, PAGE_SIZE, PERIODS, SORT_OPTIONS } from "./options";

/** Estado de la búsqueda. La URL es su única fuente de verdad. */
export type SearchFilters = {
  q?: string;
  type?: string;
  period?: string;
  artist?: string;
  sort?: SortOrder;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

export const MAX_PAGE = Math.floor(MAX_RESULT_WINDOW / PAGE_SIZE);

const text = z.string().trim().min(1).max(120).optional().catch(undefined);
const oneOf = (values: readonly string[]) =>
  z
    .enum(values as [string, ...string[]])
    .optional()
    .catch(undefined);

const filtersSchema = z.object({
  q: text,
  tipo: oneOf(ARTWORK_TYPES.map((t) => t.value)),
  epoca: oneOf(PERIODS.map((p) => p.value)),
  artista: text,
  orden: oneOf(SORT_OPTIONS.map((s) => s.value)),
  pagina: z.coerce
    .number()
    .int()
    .min(1)
    .catch(1)
    .transform((page) => Math.min(page, MAX_PAGE)),
});

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** Lee y valida los filtros de la URL. Un valor inválido se ignora; nunca rompe la página. */
export function parseSearchFilters(params: RawParams): SearchFilters {
  const raw = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, first(value)]));
  const parsed = filtersSchema.parse({ ...raw, pagina: raw.pagina ?? 1 });
  const filters: SearchFilters = {
    q: parsed.q,
    type: parsed.tipo,
    period: parsed.epoca,
    artist: parsed.artista,
    sort: parsed.orden as SortOrder | undefined,
    page: parsed.pagina,
  };
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined),
  ) as SearchFilters;
}

export function toSearchQuery(filters: SearchFilters): SearchQuery {
  return {
    q: filters.q,
    artworkType: filters.type,
    artist: filters.artist,
    dateRange: PERIODS.find((p) => p.value === filters.period)?.range,
    sort: filters.sort,
    page: filters.page,
    pageSize: PAGE_SIZE,
  };
}

/** URL de búsqueda con los filtros actuales y los cambios indicados. */
export function buildSearchHref(
  filters: SearchFilters,
  changes: Partial<SearchFilters> = {},
): string {
  const next = { ...filters, ...changes };
  const entries: Array<[string, string | number | undefined]> = [
    ["q", next.q],
    ["tipo", next.type],
    ["epoca", next.period],
    ["artista", next.artist],
    ["orden", next.sort === "relevance" ? undefined : next.sort],
    ["pagina", next.page > 1 ? next.page : undefined],
  ];
  const search = new URLSearchParams(
    entries.flatMap(([key, value]) =>
      value === undefined || value === "" ? [] : [[key, String(value)]],
    ),
  );
  const query = search.toString();
  return query ? `/buscar?${query}` : "/buscar";
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return Boolean(filters.q || filters.type || filters.period || filters.artist);
}
