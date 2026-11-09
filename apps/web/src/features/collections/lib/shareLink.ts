import { z } from "zod";
import { MAX_ARTWORKS, MAX_NAME_LENGTH, type Collection } from "./collection";

export type SharedCollection = Pick<Collection, "name" | "artworkIds">;
export type ShareParseResult =
  { ok: true; collection: SharedCollection } | { ok: false; reason: "empty" | "invalid" };

const DEFAULT_NAME = "Colección compartida";

const idsSchema = z
  .string()
  .regex(/^\d{1,9}(,\d{1,9})*$/)
  .transform((value) => [...new Set(value.split(",").map(Number))])
  .pipe(z.array(z.number().int().positive()).min(1).max(MAX_ARTWORKS));

const sharedSchema = z.object({
  nombre: z.string().trim().min(1).max(MAX_NAME_LENGTH).optional(),
  obras: idsSchema,
});

/** Enlace para compartir: la colección entera viaja en la URL, sin servidor ni cuentas. */
export function buildShareHref(collection: SharedCollection): string {
  const params = new URLSearchParams({
    nombre: collection.name,
    obras: collection.artworkIds.join(","),
  });
  return `/coleccion?${params}`;
}

/** Valida lo que llega en un enlace: nunca se confía en una URL que alguien pudo editar. */
export function parseSharedCollection(
  params: Record<string, string | string[] | undefined>,
): ShareParseResult {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const raw = { nombre: first(params.nombre), obras: first(params.obras) };
  if (!raw.obras) return { ok: false, reason: "empty" };
  const parsed = sharedSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: "invalid" };
  return {
    ok: true,
    collection: { name: parsed.data.nombre ?? DEFAULT_NAME, artworkIds: parsed.data.obras },
  };
}
