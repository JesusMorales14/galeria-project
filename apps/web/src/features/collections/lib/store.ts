import type { Collection } from "./collection";
import { createIndexedDbRepository } from "./indexedDbRepository";
import { createMemoryRepository } from "./repository";
import { createCollectionsService, type CollectionsService } from "./service";

/**
 * Estado de las colecciones para React (useSyncExternalStore).
 * - null mientras carga (y siempre en el servidor: IndexedDB solo existe en el navegador).
 * - Se sincroniza entre pestañas con BroadcastChannel.
 */
export type CollectionsSnapshot = { collections: Collection[]; persistent: boolean } | null;

const CHANNEL = "galeria:colecciones";
let service: CollectionsService | null = null;
let persistent = true;
let snapshot: CollectionsSnapshot = null;
const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;

async function resolveService(): Promise<CollectionsService> {
  if (service) return service;
  const indexed = createIndexedDbRepository();
  try {
    await indexed.list();
    service = createCollectionsService(indexed);
  } catch {
    persistent = false; // sin IndexedDB: funciona, pero no sobrevive a cerrar la pestaña
    service = createCollectionsService(createMemoryRepository());
  }
  return service;
}

async function refresh() {
  const collections = await (await resolveService()).list();
  snapshot = { collections, persistent };
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    void refresh();
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(CHANNEL);
      channel.onmessage = () => void refresh();
    }
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) channel?.close();
  };
}

export const getSnapshot = (): CollectionsSnapshot => snapshot;
export const getServerSnapshot = (): CollectionsSnapshot => null;

/** Ejecuta un caso de uso, refresca la vista y avisa a las otras pestañas. */
export async function mutate<T>(action: (service: CollectionsService) => Promise<T>): Promise<T> {
  const result = await action(await resolveService());
  await refresh();
  channel?.postMessage("changed");
  return result;
}

/** Solo para tests: vuelve al estado inicial. */
export function resetStoreForTests() {
  service = null;
  persistent = true;
  snapshot = null;
}
