/** El id de la URL se valida antes de llegar a la API: solo enteros positivos. */
export function parseArtworkId(value: string): number | null {
  if (!/^\d{1,9}$/.test(value)) return null;
  const id = Number(value);
  return id > 0 ? id : null;
}
