/** Campos que se piden a la API: solo lo que la interfaz usa (respuestas más ligeras). */
export const SUMMARY_FIELDS = [
  "id",
  "title",
  "artist_title",
  "date_display",
  "artwork_type_title",
  "image_id",
  "thumbnail",
] as const;

export const ARTWORK_FIELDS = [
  ...SUMMARY_FIELDS,
  "artist_display",
  "date_start",
  "date_end",
  "is_public_domain",
  "medium_display",
  "dimensions",
  "place_of_origin",
  "description",
  "short_description",
  "credit_line",
  "department_title",
  "style_title",
] as const;
