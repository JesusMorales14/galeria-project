import { describe, expect, it } from "vitest";
import { buildSearchHref, parseSearchFilters, toSearchQuery } from "./searchParams";

describe("parseSearchFilters", () => {
  it("lee texto, filtros, orden y página de la URL", () => {
    expect(
      parseSearchFilters({
        q: " monet ",
        tipo: "Painting",
        epoca: "1800-1899",
        artista: "Claude Monet",
        orden: "oldest",
        pagina: "2",
      }),
    ).toEqual({
      q: "monet",
      type: "Painting",
      period: "1800-1899",
      artist: "Claude Monet",
      sort: "oldest",
      page: 2,
    });
  });

  it("descarta valores desconocidos o manipulados en lugar de fallar", () => {
    expect(
      parseSearchFilters({ tipo: "<script>", epoca: "1066", orden: "x", pagina: "-3" }),
    ).toEqual({ page: 1 });
  });

  it("usa el primer valor si un parámetro llega repetido", () => {
    expect(parseSearchFilters({ q: ["uno", "dos"] }).q).toBe("uno");
  });

  it("limita la página al máximo que permite la API", () => {
    expect(parseSearchFilters({ pagina: "9999" }).page).toBe(416);
  });
});

describe("toSearchQuery", () => {
  it("traduce la época a un rango de años y fija el tamaño de página", () => {
    expect(toSearchQuery({ page: 1, period: "1800-1899" })).toMatchObject({
      dateRange: { from: 1800, to: 1899 },
      pageSize: 24,
      page: 1,
    });
  });
});

describe("buildSearchHref", () => {
  it("conserva los filtros y cambia solo lo indicado", () => {
    expect(buildSearchHref({ q: "monet", type: "Painting", page: 1 }, { page: 3 })).toBe(
      "/buscar?q=monet&tipo=Painting&pagina=3",
    );
  });

  it("omite la página 1 y los valores vacíos", () => {
    expect(buildSearchHref({ q: "monet", page: 4 }, { page: 1, q: undefined })).toBe("/buscar");
  });
});
