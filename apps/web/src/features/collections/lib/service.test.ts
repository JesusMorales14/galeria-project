import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { CollectionError } from "./collection";
import { createIndexedDbRepository } from "./indexedDbRepository";
import { createMemoryRepository, type CollectionsRepository } from "./repository";
import { createCollectionsService } from "./service";

// El mismo contrato se prueba contra las dos implementaciones del repositorio.
const repositories: Array<[string, () => CollectionsRepository]> = [
  ["memoria", () => createMemoryRepository()],
  ["IndexedDB", () => createIndexedDbRepository()],
];

describe.each(repositories)("servicio de colecciones (%s)", (_name, makeRepository) => {
  it("crea, lista y recupera colecciones; persisten entre instancias", async () => {
    const repository = makeRepository();
    const service = createCollectionsService(repository);
    const created = await service.create("Para mi sala", [27992]);

    expect(await service.get(created.id)).toEqual(created);
    expect((await service.list()).map((c) => c.name)).toContain("Para mi sala");
  });

  it("añade, reordena y quita obras", async () => {
    const service = createCollectionsService(makeRepository());
    const { id } = await service.create("Impresionismo", [1, 2]);

    await service.addArtwork(id, 3);
    await service.moveArtwork(id, { artworkId: 3, toIndex: 0 });
    expect((await service.get(id))?.artworkIds).toEqual([3, 1, 2]);

    await service.removeArtwork(id, 1);
    expect((await service.get(id))?.artworkIds).toEqual([3, 2]);
  });

  it("renombra y borra", async () => {
    const service = createCollectionsService(makeRepository());
    const { id } = await service.create("Borrador");

    await service.rename(id, "Final");
    expect((await service.get(id))?.name).toBe("Final");

    await service.remove(id);
    expect(await service.get(id)).toBeNull();
  });

  it("falla de forma clara si la colección ya no existe", async () => {
    const service = createCollectionsService(makeRepository());
    await expect(service.addArtwork("no-existe", 1)).rejects.toBeInstanceOf(CollectionError);
  });
});
