import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";
import { securityHeaders } from "./src/shared/security/headers";

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  // En la imagen Docker (NEXT_OUTPUT=standalone): servidor autónomo con solo las dependencias
  // que usa. La raíz de trazado es la del monorepo para incluir packages/*.
  ...(process.env.NEXT_OUTPUT === "standalone" && {
    output: "standalone" as const,
    outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
  }),
  // Memoización automática de componentes y valores: solo se re-renderiza lo que cambia,
  // sin useMemo/useCallback/React.memo escritos a mano.
  reactCompiler: true,
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return [{ source: "/:path*", headers: securityHeaders(isDev) }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

/**
 * Sentry: sube los source maps en el build de Vercel (si hay SENTRY_AUTH_TOKEN)
 * y los borra después, para que no se publiquen junto a la app.
 */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  telemetry: false,
});
