const numberFormat = new Intl.NumberFormat("es-ES");

/** Texto del resumen de resultados; también es lo que se anuncia al lector de pantalla. */
export function resultsSummary(total: number, page: number, totalPages: number): string {
  if (total === 0) return "No se encontraron obras";
  const count =
    total === 1 ? "1 obra encontrada" : `${numberFormat.format(total)} obras encontradas`;
  return totalPages > 1 ? `${count} · página ${page} de ${totalPages}` : count;
}
