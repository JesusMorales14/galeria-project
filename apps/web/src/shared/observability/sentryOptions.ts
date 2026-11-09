/**
 * Opciones de Sentry compartidas por cliente, servidor y edge.
 * Sin DSN (desarrollo, tests, forks) el SDK queda desactivado y no envía nada.
 */
type Env = Record<string, string | undefined>;

/**
 * Next.js solo inyecta en el navegador las lecturas literales `process.env.NEXT_PUBLIC_*`.
 * Pasar `process.env` entero dejaría el DSN vacío en el cliente.
 */
function readEnv(): Env {
  return {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
  };
}

export function sentryOptions(env: Env = readEnv()) {
  const environment = env.NEXT_PUBLIC_VERCEL_ENV ?? env.VERCEL_ENV ?? env.NODE_ENV ?? "development";
  return {
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: Boolean(env.NEXT_PUBLIC_SENTRY_DSN),
    environment,
    // Producción: 20 % de las trazas; vistas previas: todas, para depurar antes de publicar.
    tracesSampleRate: environment === "production" ? 0.2 : 1,
    // Nunca IPs, cookies ni cabeceras del usuario.
    sendDefaultPii: false,
  };
}
