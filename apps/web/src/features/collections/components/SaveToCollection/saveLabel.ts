/** Texto del botón según en cuántas colecciones está ya la obra. */
export function saveLabel(savedIn: number): string {
  if (savedIn === 0) return "Guardar en colección";
  return `Guardada en ${savedIn} ${savedIn === 1 ? "colección" : "colecciones"}`;
}
