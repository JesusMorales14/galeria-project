import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSnapshot, mutate, resetStoreForTests, subscribe } from "./store";

beforeEach(() => {
  resetStoreForTests();
  globalThis.indexedDB = new IDBFactory();
});

describe("store de colecciones", () => {
  it("notifica a los suscriptores tras cada cambio", async () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    await mutate((service) => service.create("Nueva"));

    expect(getSnapshot()?.collections.map((c) => c.name)).toEqual(["Nueva"]);
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it("se puede modificar después de que todos se desuscriban (canal cerrado)", async () => {
    subscribe(() => undefined)();
    await expect(mutate((service) => service.create("Tras cerrar"))).resolves.toMatchObject({
      name: "Tras cerrar",
    });
  });

  it("si IndexedDB no está disponible, funciona en memoria y lo indica", async () => {
    // @ts-expect-error simula un navegador sin IndexedDB
    globalThis.indexedDB = undefined;
    await mutate((service) => service.create("Temporal"));
    expect(getSnapshot()).toMatchObject({ persistent: false });
  });
});
