/**
 * Cabeceras de seguridad de todas las respuestas.
 * La CSP no usa nonces a propósito: un nonce obliga a renderizar cada página por petición
 * y perderíamos el HTML estático de Cache Components (ver docs/adr/0009). A cambio,
 * 'unsafe-inline' en scripts queda acotado por el resto de directivas (sin orígenes
 * externos, sin object/embed, sin base ni form-action ajenos).
 */
export type Header = { key: string; value: string };

const SENTRY_INGEST =
  "https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io";

export function contentSecurityPolicy(isDev: boolean): string {
  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": `'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src": "'self' 'unsafe-inline'",
    // Las obras llegan por nuestro proxy /api/iiif; los lqip del museo son data: URIs.
    "img-src": "'self' data: blob:",
    "font-src": "'self'",
    "connect-src": `'self' ${SENTRY_INGEST}${isDev ? " ws: wss:" : ""}`,
    "object-src": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
    "worker-src": "'self' blob:",
  };
  const policy = Object.entries(directives).map(([name, value]) => `${name} ${value}`);
  if (!isDev) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

export function securityHeaders(isDev: boolean): Header[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(isDev) },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}
