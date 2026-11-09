import { z } from "zod";
import { MAX_ARTWORKS, MAX_NAME_LENGTH, type Collection } from "./collection";

const collectionSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  artworkIds: z.array(z.number().int().positive()).max(MAX_ARTWORKS),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const fileSchema = z.object({
  version: z.literal(1),
  collections: z.array(collectionSchema).max(200),
});

/** Copia de seguridad en JSON: el usuario no depende de un solo navegador. */
export function exportCollections(collections: Collection[]): string {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), collections }, null, 2);
}

export function parseImport(text: string): { ok: true; collections: Collection[] } | { ok: false } {
  try {
    const parsed = fileSchema.safeParse(JSON.parse(text));
    return parsed.success ? { ok: true, collections: parsed.data.collections } : { ok: false };
  } catch {
    return { ok: false };
  }
}
