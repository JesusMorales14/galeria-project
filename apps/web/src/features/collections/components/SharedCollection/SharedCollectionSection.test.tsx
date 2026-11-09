import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { searchResponse } from "../../../../../test/aicResponses";
import { SharedCollectionSection } from "./SharedCollectionSection";

vi.mock("next/cache", () => ({ cacheLife: () => undefined, cacheTag: () => undefined }));

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

async function renderShared(params: Record<string, string>) {
  render(await SharedCollectionSection({ searchParams: Promise.resolve(params) }));
}

describe("SharedCollectionSection", () => {
  it("abre una colección compartida y avisa de las obras que ya no existen", async () => {
    const { data, config } = searchResponse(2, 2);
    server.use(
      http.get("https://api.artic.edu/api/v1/artworks", () => HttpResponse.json({ data, config })),
    );

    await renderShared({ nombre: "Para mi sala", obras: "1,2,3" });

    expect(screen.getByRole("heading", { name: "Para mi sala" })).toBeDefined();
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByText(/1 ya no están/)).toBeDefined();
    expect(screen.getByRole("button", { name: "Guardar en mis colecciones" })).toBeDefined();
  });

  it("un enlace manipulado muestra un mensaje claro, sin llamar a la API", async () => {
    await renderShared({ obras: "1;DROP TABLE" });

    expect(
      screen.getByRole("heading", { name: "Este enlace de colección no es válido" }),
    ).toBeDefined();
    expect(screen.getByRole("link", { name: "Buscar obras" })).toBeDefined();
  });
});
