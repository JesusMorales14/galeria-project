import { z } from "zod";

/**
 * Contrato con la API del Art Institute of Chicago.
 * Solo `id` y `title` son obligatorios: el resto puede faltar o venir en null
 * (obras sin imagen, sin fecha, sin descripción) y no debe romper la interfaz.
 */
const optionalText = z
  .string()
  .nullish()
  .transform((value) => value ?? null);
const optionalNumber = z
  .number()
  .nullish()
  .transform((value) => value ?? null);

export const rawThumbnailSchema = z.object({
  lqip: optionalText,
  width: optionalNumber,
  height: optionalNumber,
  alt_text: optionalText,
});

export const rawArtworkSummarySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  artist_title: optionalText,
  date_display: optionalText,
  artwork_type_title: optionalText,
  image_id: optionalText,
  thumbnail: rawThumbnailSchema.nullish().transform((value) => value ?? null),
});

export const rawArtworkSchema = rawArtworkSummarySchema.extend({
  artist_display: optionalText,
  date_start: optionalNumber,
  date_end: optionalNumber,
  is_public_domain: z
    .boolean()
    .nullish()
    .transform((value) => value ?? false),
  medium_display: optionalText,
  dimensions: optionalText,
  place_of_origin: optionalText,
  description: optionalText,
  short_description: optionalText,
  credit_line: optionalText,
  department_title: optionalText,
  style_title: optionalText,
});

export const rawConfigSchema = z.object({ iiif_url: z.url() });

export const rawPaginationSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
});

export const rawArtworkResponseSchema = z.object({
  data: rawArtworkSchema,
  config: rawConfigSchema,
});

/** Los registros de una lista se validan uno a uno (ver parseList). */
export const rawListResponseSchema = z.object({
  data: z.array(z.unknown()),
  config: rawConfigSchema,
});

export const rawSearchResponseSchema = rawListResponseSchema.extend({
  pagination: rawPaginationSchema,
});

export type RawArtwork = z.infer<typeof rawArtworkSchema>;
export type RawArtworkSummary = z.infer<typeof rawArtworkSummarySchema>;
