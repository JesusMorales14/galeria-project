import * as Sentry from "@sentry/nextjs";

/** Next.js llama a register() al arrancar cada runtime del servidor. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");
  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

/** Errores de Server Components, Route Handlers y Server Actions, con la ruta y el tipo de render. */
export const onRequestError = Sentry.captureRequestError;
