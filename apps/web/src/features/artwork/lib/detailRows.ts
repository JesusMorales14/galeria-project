import type { Artwork } from "@galeria/api-client";

export type DetailRow = { label: string; value: string };

const ROWS: ReadonlyArray<[string, keyof Artwork]> = [
  ["Fecha", "date"],
  ["Técnica", "medium"],
  ["Medidas", "dimensions"],
  ["Origen", "placeOfOrigin"],
  ["Estilo", "style"],
  ["Departamento", "department"],
  ["Crédito", "creditLine"],
];

/** Filas de la ficha técnica, solo con los datos que existen. */
export function artworkDetailRows(artwork: Artwork): DetailRow[] {
  return ROWS.flatMap(([label, key]) => {
    const value = artwork[key];
    return typeof value === "string" && value.trim() ? [{ label, value }] : [];
  });
}
