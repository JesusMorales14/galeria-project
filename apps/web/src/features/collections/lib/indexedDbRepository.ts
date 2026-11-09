import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Collection } from "./collection";
import { byRecent, type CollectionsRepository } from "./repository";

interface GaleriaDB extends DBSchema {
  collections: { key: string; value: Collection };
}

const DB_NAME = "galeria";
const DB_VERSION = 1;

function open(): Promise<IDBPDatabase<GaleriaDB>> {
  return openDB<GaleriaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore("collections", { keyPath: "id" });
    },
  });
}

/** Colecciones en IndexedDB: persisten entre visitas y admiten más datos que localStorage. */
export function createIndexedDbRepository(): CollectionsRepository {
  let database: Promise<IDBPDatabase<GaleriaDB>> | null = null;
  const db = () => (database ??= open());

  return {
    list: async () => (await (await db()).getAll("collections")).sort(byRecent),
    get: async (id) => (await (await db()).get("collections", id)) ?? null,
    save: async (collection) => void (await (await db()).put("collections", collection)),
    remove: async (id) => (await db()).delete("collections", id),
  };
}
