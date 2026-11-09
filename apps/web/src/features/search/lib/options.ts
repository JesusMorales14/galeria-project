import type { DateRange, SortOrder } from "@galeria/api-client";

/** Valores que entiende la API (en inglés) con su etiqueta en español. */
export const ARTWORK_TYPES = [
  { value: "Painting", label: "Pintura" },
  { value: "Print", label: "Grabado" },
  { value: "Drawing and Watercolor", label: "Dibujo y acuarela" },
  { value: "Photograph", label: "Fotografía" },
  { value: "Sculpture", label: "Escultura" },
  { value: "Textile", label: "Textil" },
] as const;

export const PERIODS: ReadonlyArray<{ value: string; label: string; range: DateRange }> = [
  { value: "antes-1400", label: "Antes de 1400", range: { from: -8000, to: 1399 } },
  { value: "1400-1599", label: "1400–1599", range: { from: 1400, to: 1599 } },
  { value: "1600-1799", label: "1600–1799", range: { from: 1600, to: 1799 } },
  { value: "1800-1899", label: "Siglo XIX", range: { from: 1800, to: 1899 } },
  { value: "1900-2100", label: "Desde 1900", range: { from: 1900, to: 2100 } },
];

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOrder; label: string }> = [
  { value: "relevance", label: "Relevancia" },
  { value: "oldest", label: "Más antiguas primero" },
  { value: "newest", label: "Más recientes primero" },
];

export const PAGE_SIZE = 24;
