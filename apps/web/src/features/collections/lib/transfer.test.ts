import { describe, expect, it } from "vitest";
import { exportCollections } from "./exportCollections";
import { parseImport } from "./transfer";

const collection = {
  id: "c1",
  name: "Sala",
  artworkIds: [1, 2],
  createdAt: "2026-11-09T12:00:00.000Z",
  updatedAt: "2026-11-09T12:00:00.000Z",
};

describe("exportar e importar", () => {
  it("exporta un JSON versionado que se puede volver a importar", () => {
    const json = exportCollections([collection]);
    expect(JSON.parse(json).version).toBe(1);
    expect(parseImport(json)).toEqual({ ok: true, collections: [collection] });
  });

  it("rechaza archivos que no son de Galería o están dañados", () => {
    expect(parseImport("no es json")).toEqual({ ok: false });
    expect(parseImport(JSON.stringify({ version: 1, collections: [{ id: 1 }] }))).toEqual({
      ok: false,
    });
  });
});
