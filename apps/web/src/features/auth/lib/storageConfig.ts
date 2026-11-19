export type StorageConfig = { kind: "postgres"; url: string } | { kind: "memory" };

type Source = Record<string, string | undefined>;

/**
 * Dónde se guardan cuentas, sesiones e intentos.
 * - Con DATABASE_URL: Postgres (sobrevive a reinicios y se comparte entre réplicas).
 * - Sin ella, en desarrollo y tests: memoria.
 * - Sin ella en producción: error al arrancar. Perder las cuentas en silencio en cada
 *   despliegue sería peor que no arrancar. AUTH_STORAGE=memory lo permite a propósito
 *   (e2e y Lighthouse contra el build).
 */
export function readStorageConfig(env: Source = process.env): StorageConfig {
  if (env.DATABASE_URL) return { kind: "postgres", url: env.DATABASE_URL };
  if (env.NODE_ENV === "production" && env.AUTH_STORAGE !== "memory") {
    throw new Error(
      "DATABASE_URL es obligatoria en producción para guardar cuentas y sesiones. " +
        "Define AUTH_STORAGE=memory solo para pruebas.",
    );
  }
  return { kind: "memory" };
}
