import type { Collection } from "./collection";

/** Copia de seguridad en JSON: el usuario no depende de un solo navegador. */
export function exportCollections(collections: Collection[]): string {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), collections }, null, 2);
}
