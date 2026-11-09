import { z } from "zod";

/** Máximo de obras por petición (una colección grande se pide en varias). */
export const MAX_IDS = 100;

const idSchema = z
  .string()
  .regex(/^\d{1,9}$/)
  .transform(Number)
  .pipe(z.number().int().positive());

const idsSchema = z
  .string()
  .min(1)
  .transform((value) => value.split(","))
  .pipe(z.array(idSchema).min(1).max(MAX_IDS))
  .transform((ids) => [...new Set(ids)]);

export type IdsQueryResult = { success: true; ids: number[] } | { success: false };

/** Valida `?ids=1,2,3`. Lo que llega por la URL nunca se usa sin validar. */
export function parseIdsQuery(search: URLSearchParams): IdsQueryResult {
  const parsed = idsSchema.safeParse(search.get("ids") ?? "");
  return parsed.success ? { success: true, ids: parsed.data } : { success: false };
}
