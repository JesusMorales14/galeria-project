/**
 * Lo mínimo que los repositorios necesitan de una base de datos: consultas parametrizadas.
 * Lo cumplen el Pool de `pg` (producción) y PGlite (tests con Postgres real en memoria).
 * Nunca se concatena texto en SQL: los valores van siempre como parámetros ($1, $2…).
 */
export interface SqlClient {
  query<Row = Record<string, unknown>>(text: string, params?: unknown[]): Promise<{ rows: Row[] }>;
}

/** timestamptz → milisegundos (pg y PGlite devuelven Date). */
export const toMillis = (value: Date | string | null): number | null =>
  value === null ? null : new Date(value).getTime();

/** milisegundos → timestamptz. */
export const toTimestamp = (millis: number) => new Date(millis).toISOString();
