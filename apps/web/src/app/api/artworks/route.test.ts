import { beforeEach, describe, expect, it, vi } from "vitest";
import { AicRateLimitError } from "@galeria/api-client";

const { getArtworksByIds } = vi.hoisted(() => ({ getArtworksByIds: vi.fn() }));
vi.mock("@/shared/api/artworks", () => ({ getArtworksByIds }));

import { GET } from "./route";

describe("GET /api/artworks", () => {
  beforeEach(() => {
    getArtworksByIds.mockReset();
  });

  it("devuelve las obras normalizadas con caché compartida", async () => {
    getArtworksByIds.mockResolvedValue([{ id: 1, title: "Obra" }]);

    const response = await GET(new Request("http://localhost/api/artworks?ids=1"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ items: [{ id: 1, title: "Obra" }] });
    expect(response.headers.get("Cache-Control")).toContain("s-maxage");
    expect(getArtworksByIds).toHaveBeenCalledWith([1]);
  });

  it("responde 400 si los ids no son válidos, sin llamar a la API", async () => {
    const response = await GET(new Request("http://localhost/api/artworks?ids=<script>"));

    expect(response.status).toBe(400);
    expect(getArtworksByIds).not.toHaveBeenCalled();
  });

  it("responde 503 si la API del museo limita las peticiones", async () => {
    getArtworksByIds.mockImplementation(async () => {
      throw new AicRateLimitError(10);
    });

    const response = await GET(new Request("http://localhost/api/artworks?ids=1"));

    expect(response.status).toBe(503);
  });
});
