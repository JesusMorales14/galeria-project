import type { Collection } from "./collection";

/**
 * Persistencia de colecciones. Los componentes y el servicio solo conocen esta interfaz:
 * hoy es IndexedDB; mañana podría ser una API con cuentas sin tocar la interfaz de usuario.
 */
export interface CollectionsRepository {
  list(): Promise<Collection[]>;
  get(id: string): Promise<Collection | null>;
  save(collection: Collection): Promise<void>;
  remove(id: string): Promise<void>;
}

const byRecent = (a: Collection, b: Collection) => b.updatedAt.localeCompare(a.updatedAt);

/** Repositorio en memoria: tests y navegadores sin IndexedDB (algunos modos privados). */
export function createMemoryRepository(initial: Collection[] = []): CollectionsRepository {
  const items = new Map(initial.map((collection) => [collection.id, collection]));
  return {
    list: async () => [...items.values()].sort(byRecent),
    get: async (id) => items.get(id) ?? null,
    save: async (collection) => void items.set(collection.id, collection),
    remove: async (id) => void items.delete(id),
  };
}

export { byRecent };
