import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useArtworksByIds } from "./useArtworksByIds";

const artwork = (id: number) => ({
  id,
  title: `Obra ${id}`,
  artist: null,
  date: null,
  artworkType: null,
  image: null,
});

afterEach(() => vi.unstubAllGlobals());

describe("useArtworksByIds", () => {
  it("pide al BFF y devuelve las obras en el orden de la colección", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ items: [artwork(1), artwork(2)] }));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useArtworksByIds([2, 1]));

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/artworks?ids=1,2");
    expect(result.current.status === "ready" && result.current.artworks.map((a) => a.id)).toEqual([
      2, 1,
    ]);
  });

  it("reordenar no vuelve a pedir los datos", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ items: [artwork(1), artwork(2)] }));
    vi.stubGlobal("fetch", fetchMock);

    const { result, rerender } = renderHook(({ ids }) => useArtworksByIds(ids), {
      initialProps: { ids: [1, 2] },
    });
    await waitFor(() => expect(result.current.status).toBe("ready"));
    rerender({ ids: [2, 1] });

    expect(result.current.status === "ready" && result.current.artworks.map((a) => a.id)).toEqual([
      2, 1,
    ]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("informa de las obras que ya no existen y de los errores", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ items: [artwork(1)] })));
    const { result } = renderHook(() => useArtworksByIds([1, 9]));
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.status === "ready" && result.current.missing).toBe(1);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    const failing = renderHook(() => useArtworksByIds([5]));
    await waitFor(() => expect(failing.result.current.status).toBe("error"));
  });
});
