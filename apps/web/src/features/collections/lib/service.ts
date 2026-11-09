import {
  addArtwork,
  CollectionError,
  createCollection,
  moveArtwork,
  removeArtwork,
  renameCollection,
  type ArtworkMove,
  type Collection,
} from "./collection";
import type { CollectionsRepository } from "./repository";

/** Casos de uso de las colecciones. Solo dependen de la interfaz del repositorio. */
export function createCollectionsService(repository: CollectionsRepository) {
  async function update(
    id: string,
    change: (collection: Collection) => Collection,
  ): Promise<Collection> {
    const current = await repository.get(id);
    if (!current) throw new CollectionError("La colección ya no existe.");
    const next = change(current);
    if (next !== current) await repository.save(next);
    return next;
  }

  return {
    list: () => repository.list(),
    get: (id: string) => repository.get(id),
    async create(name: string, artworkIds: number[] = []) {
      const collection = artworkIds.reduce(
        (acc, id) => addArtwork(acc, id),
        createCollection(name),
      );
      await repository.save(collection);
      return collection;
    },
    rename: (id: string, name: string) => update(id, (c) => renameCollection(c, name)),
    remove: (id: string) => repository.remove(id),
    addArtwork: (id: string, artworkId: number) => update(id, (c) => addArtwork(c, artworkId)),
    removeArtwork: (id: string, artworkId: number) =>
      update(id, (c) => removeArtwork(c, artworkId)),
    moveArtwork: (id: string, move: ArtworkMove) => update(id, (c) => moveArtwork(c, move)),
    /** Importa una copia de seguridad: añade o reemplaza por id. */
    async importMany(collections: Collection[]) {
      for (const collection of collections) await repository.save(collection);
    },
  };
}

export type CollectionsService = ReturnType<typeof createCollectionsService>;
