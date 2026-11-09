import { describe, expect, it } from "vitest";
import { buildSearchRequest, MAX_RESULT_WINDOW } from "./buildSearchRequest";

function decode(search: URLSearchParams) {
  return JSON.parse(search.get("params") ?? "{}");
}

describe("buildSearchRequest", () => {
  it("filtra siempre por dominio público y con imagen", () => {
    const body = decode(buildSearchRequest({ page: 1, pageSize: 24 }));
    expect(body.query.bool.filter).toEqual(
      expect.arrayContaining([
        { term: { is_public_domain: true } },
        { exists: { field: "image_id" } },
      ]),
    );
  });

  it("calcula el desplazamiento a partir de la página", () => {
    const body = decode(buildSearchRequest({ page: 3, pageSize: 24 }));
    expect(body.from).toBe(48);
    expect(body.size).toBe(24);
  });

  it("incluye texto, tipo, artista y época", () => {
    const body = decode(
      buildSearchRequest({
        page: 1,
        pageSize: 10,
        q: "  monet ",
        artworkType: "Painting",
        artist: "Claude Monet",
        dateRange: { from: 1800, to: 1899 },
      }),
    );
    expect(body.q).toBe("monet");
    expect(body.query.bool.filter).toEqual(
      expect.arrayContaining([
        { match: { artwork_type_title: { query: "Painting", operator: "and" } } },
        { match: { artist_title: { query: "Claude Monet", operator: "and" } } },
        { range: { date_start: { gte: 1800, lte: 1899 } } },
      ]),
    );
  });

  it("ordena por fecha cuando se pide", () => {
    expect(decode(buildSearchRequest({ page: 1, pageSize: 10, sort: "oldest" })).sort).toEqual([
      { date_start: "asc" },
    ]);
    expect(decode(buildSearchRequest({ page: 1, pageSize: 10, sort: "newest" })).sort).toEqual([
      { date_start: "desc" },
    ]);
    expect(decode(buildSearchRequest({ page: 1, pageSize: 10 })).sort).toBeUndefined();
  });

  it("no pide resultados más allá de la ventana de 10.000 de la API", () => {
    const body = decode(buildSearchRequest({ page: 999, pageSize: 24 }));
    expect(body.from + body.size).toBeLessThanOrEqual(MAX_RESULT_WINDOW);
  });

  it("solicita solo los campos necesarios", () => {
    expect(buildSearchRequest({ page: 1, pageSize: 10 }).get("fields")).toContain("image_id");
  });
});
