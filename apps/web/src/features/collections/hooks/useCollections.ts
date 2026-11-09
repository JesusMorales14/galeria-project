"use client";

import { useSyncExternalStore } from "react";
import type { ArtworkMove, Collection } from "../lib/collection";
import { getServerSnapshot, getSnapshot, mutate, subscribe } from "../lib/store";

/** Colecciones del usuario (null mientras cargan) y las acciones para modificarlas. */
export function useCollections() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    collections: snapshot?.collections ?? null,
    persistent: snapshot?.persistent ?? true,
    create: (name: string, artworkIds?: number[]) => mutate((s) => s.create(name, artworkIds)),
    rename: (id: string, name: string) => mutate((s) => s.rename(id, name)),
    remove: (id: string) => mutate((s) => s.remove(id)),
    addArtwork: (id: string, artworkId: number) => mutate((s) => s.addArtwork(id, artworkId)),
    removeArtwork: (id: string, artworkId: number) => mutate((s) => s.removeArtwork(id, artworkId)),
    moveArtwork: (id: string, move: ArtworkMove) => mutate((s) => s.moveArtwork(id, move)),
    importMany: (collections: Collection[]) => mutate((s) => s.importMany(collections)),
  };
}
