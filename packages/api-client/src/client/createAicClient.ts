import { ARTWORK_FIELDS, SUMMARY_FIELDS } from "../aic/fields";
import { normalizeArtwork } from "../aic/normalizeArtwork";
import { parseArtworkList } from "../aic/parseList";
import {
  rawArtworkResponseSchema,
  rawListResponseSchema,
  rawSearchResponseSchema,
} from "../aic/schemas";
import type { Artwork, ArtworkSummary, SearchQuery, SearchResult } from "../domain";
import { buildSearchRequest, totalPages } from "../search/buildSearchRequest";
import { getJson, parseContract, type HttpConfig } from "./http";

export const DEFAULT_BASE_URL = "https://api.artic.edu/api/v1";

export type AicClientOptions = {
  userAgent: string;
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type AicClient = {
  getArtwork(id: number): Promise<Artwork | null>;
  getArtworksByIds(ids: readonly number[]): Promise<ArtworkSummary[]>;
  searchArtworks(query: SearchQuery): Promise<SearchResult>;
};

/** Ordena los resultados según los ids pedidos (la API no garantiza el orden). */
function inRequestedOrder(items: ArtworkSummary[], ids: readonly number[]) {
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}

export function createAicClient(options: AicClientOptions): AicClient {
  const config: HttpConfig = {
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    userAgent: options.userAgent,
    // Se resuelve en cada llamada: así funcionan los interceptores (MSW, Sentry).
    fetch: options.fetch ?? ((input, init) => globalThis.fetch(input, init)),
  };

  return {
    async getArtwork(id) {
      const search = new URLSearchParams({ fields: ARTWORK_FIELDS.join(",") });
      const data = await getJson(config, `/artworks/${id}`, search);
      if (data === null) return null;
      const response = parseContract(rawArtworkResponseSchema, data, `/artworks/${id}`);
      return normalizeArtwork(response.data, response.config.iiif_url);
    },

    async getArtworksByIds(ids) {
      if (ids.length === 0) return [];
      const search = new URLSearchParams({ ids: ids.join(","), fields: SUMMARY_FIELDS.join(",") });
      const data = await getJson(config, "/artworks", search);
      const response = parseContract(rawListResponseSchema, data, "/artworks?ids");
      return inRequestedOrder(parseArtworkList(response.data, response.config.iiif_url), ids);
    },

    async searchArtworks(query) {
      const data = await getJson(config, "/artworks/search", buildSearchRequest(query));
      const response = parseContract(rawSearchResponseSchema, data, "/artworks/search");
      return {
        items: parseArtworkList(response.data, response.config.iiif_url),
        total: response.pagination.total,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: totalPages(response.pagination.total, query.pageSize),
      };
    },
  };
}
