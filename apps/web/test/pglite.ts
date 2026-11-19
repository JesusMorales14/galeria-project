import { PGlite } from "@electric-sql/pglite";
import type { SqlClient } from "@/features/auth/lib/postgres/sqlClient";
// Módulo JavaScript plano compartido con el script de despliegue (tipado con JSDoc).
import { migrate } from "../db/migrate.mjs";

/** Adaptador de PGlite (Postgres real compilado a WebAssembly) a la interfaz SqlClient. */
export function pgliteClient(db: PGlite): SqlClient {
  return {
    async query(text, params) {
      // Sin parámetros puede haber varias sentencias (migraciones): exec las admite.
      if (!params || params.length === 0) {
        const results = await db.exec(text);
        return { rows: (results.at(-1)?.rows ?? []) as never[] };
      }
      const result = await db.query(text, params);
      return { rows: result.rows as never[] };
    },
  };
}

/** Base de datos nueva, migrada con las mismas migraciones que producción. */
export async function createTestDatabase() {
  const db = new PGlite();
  const client = pgliteClient(db);
  const applied: string[] = await migrate(client);
  return {
    client,
    applied,
    migrateAgain: (): Promise<string[]> => migrate(client),
    reset: () =>
      client.query("TRUNCATE users, refresh_tokens, sign_in_attempts RESTART IDENTITY CASCADE"),
    close: () => db.close(),
  };
}
