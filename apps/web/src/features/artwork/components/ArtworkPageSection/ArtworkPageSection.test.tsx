import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { artworkResponse, searchResponse } from "../../../../../test/aicResponses";
import { ArtworkPageSection } from "./ArtworkPageSection";

vi.mock("next/cache", () => ({ cacheLife: () => undefined, cacheTag: () => undefined }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const API = "https://api.artic.edu/api/v1";
const server = setupServer(
  http.get(`${API}/artworks/search`, () => HttpResponse.json(searchResponse(0, 0))),
);

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

async function renderPage(id: string) {
  render(await ArtworkPageSection({ params: Promise.resolve({ id }) }));
}

describe("ArtworkPageSection (integración)", () => {
  it("muestra una obra completa con su ficha, alt y datos estructurados", async () => {
    server.use(http.get(`${API}/artworks/27992`, () => HttpResponse.json(artworkResponse())));

    await renderPage("27992");

    expect(screen.getByRole("heading", { level: 1, name: "The Bedroom" })).toBeDefined();
    expect(
      screen.getByRole("img", { name: "The Bedroom, de Vincent van Gogh, 1889" }),
    ).toBeDefined();
    expect(screen.getByText("Oil on canvas")).toBeDefined();
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(jsonLd?.textContent ?? "{}")["@type"]).toBe("VisualArtwork");
  });

  it("una obra sin imagen lo explica en lugar de mostrar un hueco", async () => {
    server.use(
      http.get(`${API}/artworks/5`, () =>
        HttpResponse.json(artworkResponse({ image_id: null, id: 5 })),
      ),
    );

    await renderPage("5");

    expect(screen.getByText("El museo no tiene una imagen de esta obra.")).toBeDefined();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("una obra inexistente muestra el 404", async () => {
    server.use(
      http.get(`${API}/artworks/1`, () => HttpResponse.json({ status: 404 }, { status: 404 })),
    );

    await expect(renderPage("1")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("un id manipulado muestra el 404 sin llamar a la API", async () => {
    await expect(renderPage("1;DROP")).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
