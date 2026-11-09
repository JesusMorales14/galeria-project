import { z } from "zod";

/** Una colección guardada en el navegador del usuario. */
export type Collection = {
  id: string;
  name: string;
  artworkIds: number[];
  createdAt: string;
  updatedAt: string;
};

export const MAX_NAME_LENGTH = 80;
export const MAX_ARTWORKS = 100;

export class CollectionError extends Error {
  override name = "CollectionError";
}

type Clock = () => string;
const isoNow: Clock = () => new Date().toISOString();

export const collectionNameSchema = z.string().trim().min(1).max(MAX_NAME_LENGTH);

function validName(name: string): string {
  const parsed = collectionNameSchema.safeParse(name);
  if (!parsed.success)
    throw new CollectionError(`El nombre debe tener entre 1 y ${MAX_NAME_LENGTH} caracteres.`);
  return parsed.data;
}

const touch = (collection: Collection, changes: Partial<Collection>, now: Clock): Collection => ({
  ...collection,
  ...changes,
  updatedAt: now(),
});

export function createCollection(
  name: string,
  options: { id?: string; now?: Clock } = {},
): Collection {
  const now = options.now ?? isoNow;
  const timestamp = now();
  return {
    id: options.id ?? crypto.randomUUID(),
    name: validName(name),
    artworkIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function renameCollection(
  collection: Collection,
  name: string,
  now: Clock = isoNow,
): Collection {
  return touch(collection, { name: validName(name) }, now);
}

export function addArtwork(
  collection: Collection,
  artworkId: number,
  now: Clock = isoNow,
): Collection {
  if (collection.artworkIds.includes(artworkId)) return collection;
  if (collection.artworkIds.length >= MAX_ARTWORKS) {
    throw new CollectionError(`Una colección admite como máximo ${MAX_ARTWORKS} obras.`);
  }
  return touch(collection, { artworkIds: [...collection.artworkIds, artworkId] }, now);
}

export function removeArtwork(
  collection: Collection,
  artworkId: number,
  now: Clock = isoNow,
): Collection {
  return touch(
    collection,
    { artworkIds: collection.artworkIds.filter((id) => id !== artworkId) },
    now,
  );
}

export type ArtworkMove = { artworkId: number; toIndex: number };

/** Mueve una obra a `toIndex` (acotado a la lista). */
export function moveArtwork(
  collection: Collection,
  { artworkId, toIndex }: ArtworkMove,
  now: Clock = isoNow,
): Collection {
  const rest = collection.artworkIds.filter((id) => id !== artworkId);
  if (rest.length === collection.artworkIds.length) return collection;
  const index = Math.max(0, Math.min(toIndex, rest.length));
  return touch(
    collection,
    { artworkIds: [...rest.slice(0, index), artworkId, ...rest.slice(index)] },
    now,
  );
}
