// Aplica en orden las migraciones SQL de db/migrations que aún no se han aplicado.
// JavaScript plano a propósito: lo ejecuta Railway antes de cada despliegue (scripts/migrate.mjs)
// y los tests contra un Postgres real en memoria (PGlite), con el mismo código.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const MIGRATIONS_DIR = fileURLToPath(new URL("./migrations/", import.meta.url));

/** Identificador del cerrojo: dos despliegues simultáneos no migran a la vez. */
const LOCK_ID = 727_001;

/**
 * @param {{ query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }> }} client
 * @param {{ dir?: string, log?: (message: string) => void, lock?: boolean }} [options]
 * @returns {Promise<string[]>} las migraciones aplicadas en esta ejecución
 */
export async function migrate(client, { dir = MIGRATIONS_DIR, log = () => {}, lock = true } = {}) {
  await client.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
  );
  if (lock) await client.query("SELECT pg_advisory_lock($1)", [LOCK_ID]);
  try {
    const { rows } = await client.query("SELECT name FROM schema_migrations");
    const applied = new Set(rows.map((row) => row.name));
    const pending = (await readdir(dir))
      .filter((f) => f.endsWith(".sql") && !applied.has(f))
      .sort();

    for (const name of pending) {
      const sql = await readFile(join(dir, name), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
        log(`Migración aplicada: ${name}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Falló la migración ${name}: ${error.message}`, { cause: error });
      }
    }
    if (pending.length === 0) log("La base de datos ya está al día.");
    return pending;
  } finally {
    if (lock) await client.query("SELECT pg_advisory_unlock($1)", [LOCK_ID]);
  }
}
