import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import complete from "../../test/fixtures/artwork-complete.json";
import notFound from "../../test/fixtures/error-not-found.json";
import searchResults from "../../test/fixtures/search-results.json";
import { createAicClient } from "./createAicClient";
import { AicApiError, AicContractError, AicRateLimitError } from "../errors";

const BASE = "https://api.test/api/v1";
const server = setupServer();
const client = createAicClient({ baseUrl: BASE, userAgent: "galeria-tests" });

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getArtwork", () => {
  it("devuelve la obra normalizada y envía AIC-User-Agent", async () => {
    let userAgent: string | null = null;
    server.use(
      http.get(`${BASE}/artworks/27992`, ({ request }) => {
        userAgent = request.headers.get("AIC-User-Agent");
        return HttpResponse.json(complete);
      }),
    );

    const artwork = await client.getArtwork(27992);

    expect(artwork?.title).toBe("A Sunday on La Grande Jatte — 1884");
    expect(userAgent).toBe("galeria-tests");
  });

  it("devuelve null si la obra no existe (404)", async () => {
    server.use(http.get(`${BASE}/artworks/1`, () => HttpResponse.json(notFound, { status: 404 })));

    await expect(client.getArtwork(1)).resolves.toBeNull();
  });

  it("lanza AicRateLimitError con el tiempo de espera ante un 429", async () => {
    server.use(
      http.get(`${BASE}/artworks/2`, () =>
        HttpResponse.json({}, { status: 429, headers: { "Retry-After": "30" } }),
      ),
    );

    const error = await client.getArtwork(2).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(AicRateLimitError);
    expect((error as AicRateLimitError).retryAfterSeconds).toBe(30);
  });

  it("lanza AicApiError ante un error 500", async () => {
    server.use(http.get(`${BASE}/artworks/3`, () => new HttpResponse(null, { status: 500 })));

    await expect(client.getArtwork(3)).rejects.toBeInstanceOf(AicApiError);
  });

  it("lanza AicContractError si la respuesta no cumple el contrato", async () => {
    server.use(http.get(`${BASE}/artworks/4`, () => HttpResponse.json({ data: { id: "x" } })));

    await expect(client.getArtwork(4)).rejects.toBeInstanceOf(AicContractError);
  });
});

describe("searchArtworks", () => {
  it("devuelve resultados normalizados, paginación y descarta registros inválidos", async () => {
    let params: unknown = null;
    server.use(
      http.get(`${BASE}/artworks/search`, ({ request }) => {
        params = JSON.parse(new URL(request.url).searchParams.get("params") ?? "null");
        return HttpResponse.json(searchResults);
      }),
    );

    const result = await client.searchArtworks({ q: "seurat", page: 1, pageSize: 3 });

    expect(params).toMatchObject({ q: "seurat", size: 3 });
    expect(result.items.map((item) => item.id)).toEqual([27992, 28560]);
    expect(result.items[0]?.image?.iiifBaseUrl).toBe("https://www.artic.edu/iiif/2");
    expect(result).toMatchObject({ total: 1234, page: 1, pageSize: 3, totalPages: 412 });
  });

  it("limita las páginas totales a la ventana de 10.000 resultados", async () => {
    const huge = { ...searchResults, pagination: { ...searchResults.pagination, total: 50_000 } };
    server.use(http.get(`${BASE}/artworks/search`, () => HttpResponse.json(huge)));

    const result = await client.searchArtworks({ page: 1, pageSize: 24 });

    expect(result.total).toBe(50_000);
    expect(result.totalPages).toBe(416);
  });
});

describe("getArtworksByIds", () => {
  it("pide varias obras en una sola llamada y conserva el orden pedido", async () => {
    let ids: string | null = null;
    server.use(
      http.get(`${BASE}/artworks`, ({ request }) => {
        ids = new URL(request.url).searchParams.get("ids");
        return HttpResponse.json({
          data: [...searchResults.data].reverse(),
          config: searchResults.config,
        });
      }),
    );

    const items = await client.getArtworksByIds([28560, 27992]);

    expect(ids).toBe("28560,27992");
    expect(items.map((item) => item.id)).toEqual([28560, 27992]);
  });

  it("no llama a la API si la lista está vacía", async () => {
    await expect(client.getArtworksByIds([])).resolves.toEqual([]);
  });
});
