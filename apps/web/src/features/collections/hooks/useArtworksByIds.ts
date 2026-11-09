"use client";

import { useCallback, useEffect, useState } from "react";
import type { ArtworkSummary } from "@galeria/api-client";

type Result =
  { status: "error" } | { status: "ready"; artworks: ArtworkSummary[]; missing: number };
type State = Result | { status: "loading" };

async function fetchArtworks(key: string, signal: AbortSignal): Promise<Result> {
  const response = await fetch(`/api/artworks?ids=${key}`, { signal });
  if (!response.ok) return { status: "error" };
  const { items } = (await response.json()) as { items: ArtworkSummary[] };
  return { status: "ready", artworks: items, missing: key.split(",").length - items.length };
}

/** Ordena las obras según la colección (la petición se hace por conjunto, no por orden). */
function inOrder(artworks: ArtworkSummary[], ids: readonly number[]): ArtworkSummary[] {
  const byId = new Map(artworks.map((artwork) => [artwork.id, artwork]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}

/**
 * Pide las obras al BFF (/api/artworks), nunca directamente a la API del museo.
 * La clave es el conjunto de ids: reordenar la colección no vuelve a pedir nada.
 */
export function useArtworksByIds(ids: readonly number[]) {
  const key = [...ids].sort((a, b) => a - b).join(",");
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<{ request: string; result: Result } | null>(null);
  const request = `${key}#${attempt}`;

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    fetchArtworks(key, controller.signal)
      .catch((): Result => ({ status: "error" }))
      .then((result) => {
        if (!controller.signal.aborted) setLoaded({ request, result });
      });
    return () => controller.abort();
  }, [key, request]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const result = loaded?.request === request ? loaded.result : null;
  const state: State = !key
    ? { status: "ready", artworks: [], missing: 0 }
    : result?.status === "ready"
      ? { ...result, artworks: inOrder(result.artworks, ids) }
      : (result ?? { status: "loading" });
  return { ...state, retry };
}
