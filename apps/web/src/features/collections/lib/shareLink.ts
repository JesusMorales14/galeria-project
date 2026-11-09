import type { Collection } from "./collection";

export type SharedCollection = Pick<Collection, "name" | "artworkIds">;

/** Enlace para compartir: la colección entera viaja en la URL, sin servidor ni cuentas. */
export function buildShareHref(collection: SharedCollection): string {
  const params = new URLSearchParams({
    nombre: collection.name,
    obras: collection.artworkIds.join(","),
  });
  return `/coleccion?${params}`;
}
