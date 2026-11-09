import { describe, expect, it } from "vitest";
import { searchErrorContext } from "./errorContext";

describe("searchErrorContext", () => {
  it("describe los filtros activos sin incluir el texto buscado", () => {
    const context = searchErrorContext({
      q: "retrato de mi abuela",
      artist: "Monet",
      artworkType: "Painting",
      dateRange: { from: 1800, to: 1899 },
      page: 3,
      pageSize: 24,
    });
    expect(context).toEqual({
      tipo: "Painting",
      epoca: "1800-1899",
      orden: "relevance",
      pagina: 3,
      conTexto: true,
      conArtista: true,
    });
    expect(JSON.stringify(context)).not.toContain("abuela");
  });
});
