import { describe, expect, it } from "vitest";
import {
  addArtwork,
  createCollection,
  CollectionError,
  moveArtwork,
  removeArtwork,
  renameCollection,
} from "./collection";

const now = () => "2026-11-09T12:00:00.000Z";
const base = () => createCollection("Para mi sala", { id: "c1", now });

describe("createCollection", () => {
  it("crea una colección vacía con nombre limpio", () => {
    expect(createCollection("  Impresionismo  ", { id: "c2", now })).toEqual({
      id: "c2",
      name: "Impresionismo",
      artworkIds: [],
      createdAt: now(),
      updatedAt: now(),
    });
  });

  it("rechaza nombres vacíos o demasiado largos", () => {
    expect(() => createCollection("   ", { id: "x", now })).toThrow(CollectionError);
    expect(() => createCollection("a".repeat(81), { id: "x", now })).toThrow(CollectionError);
  });
});

describe("operaciones", () => {
  it("añade obras sin duplicarlas", () => {
    const collection = addArtwork(addArtwork(base(), 27992, now), 27992, now);
    expect(collection.artworkIds).toEqual([27992]);
  });

  it("quita una obra", () => {
    expect(removeArtwork(addArtwork(base(), 1, now), 1, now).artworkIds).toEqual([]);
  });

  it("reordena una obra a otra posición, acotando la posición", () => {
    let collection = base();
    for (const id of [1, 2, 3, 4]) collection = addArtwork(collection, id, now);
    expect(moveArtwork(collection, { artworkId: 4, toIndex: 0 }, now).artworkIds).toEqual([
      4, 1, 2, 3,
    ]);
    expect(moveArtwork(collection, { artworkId: 1, toIndex: 99 }, now).artworkIds).toEqual([
      2, 3, 4, 1,
    ]);
  });

  it("renombra con las mismas reglas que al crear", () => {
    expect(renameCollection(base(), "Sala azul", now).name).toBe("Sala azul");
    expect(() => renameCollection(base(), "", now)).toThrow(CollectionError);
  });

  it("no modifica la colección original (inmutable)", () => {
    const original = base();
    addArtwork(original, 5, now);
    expect(original.artworkIds).toEqual([]);
  });
});
