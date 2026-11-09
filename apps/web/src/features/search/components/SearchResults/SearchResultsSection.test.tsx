import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { searchResponse } from "../../../../../test/aicResponses";
import { SearchResultsSection } from "./SearchResultsSection";

// La caché de Next no existe en tests: se prueba el flujo real URL → api-client → API simulada → UI.
vi.mock("next/cache", () => ({ cacheLife: () => undefined, cacheTag: () => undefined }));

const SEARCH_URL = "https://api.artic.edu/api/v1/artworks/search";
const server = setupServer();
let lastBody: Record<string, unknown> = {};

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function respondWith(body: Record<string, unknown>, status = 200) {
  server.use(
    http.get(SEARCH_URL, ({ request }) => {
      lastBody = JSON.parse(new URL(request.url).searchParams.get("params") ?? "{}");
      return HttpResponse.json(body, { status });
    }),
  );
}

async function renderSection(params: Record<string, string>) {
  render(await SearchResultsSection({ searchParams: Promise.resolve(params) }));
}

describe("SearchResultsSection (integración)", () => {
  it("busca por texto y muestra las obras con su resumen anunciado", async () => {
    respondWith(searchResponse(2, 30));

    await renderSection({ q: "monet" });

    expect(lastBody.q).toBe("monet");
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("status").textContent).toBe("30 obras encontradas · página 1 de 2");
    expect(screen.getByRole("link", { name: "Obra 1" }).getAttribute("href")).toBe("/obra/1");
  });

  it("aplica filtros de tipo y época y la página pedida", async () => {
    respondWith(searchResponse(1, 60));

    await renderSection({ tipo: "Print", epoca: "1800-1899", pagina: "2" });

    expect(JSON.stringify(lastBody)).toContain('"artwork_type_title":{"query":"Print"');
    expect(JSON.stringify(lastBody)).toContain('"date_start":{"gte":1800,"lte":1899}');
    expect(lastBody.from).toBe(24);
    expect(screen.getByRole("navigation", { name: "Paginación" })).toBeDefined();
  });

  it("sin resultados muestra el estado vacío con salida", async () => {
    respondWith(searchResponse(0, 0));

    await renderSection({ q: "zzzz", tipo: "Painting" });

    expect(
      screen.getByRole("heading", { name: "No encontramos obras con esos filtros" }),
    ).toBeDefined();
    expect(screen.getByRole("link", { name: "Limpiar filtros" }).getAttribute("href")).toBe(
      "/buscar",
    );
  });

  it("si la API falla, el error llega a error.tsx (no se pinta una página rota)", async () => {
    respondWith({}, 500);

    await expect(renderSection({ q: "monet" })).rejects.toThrow(/respondió 500/);
  });
});
