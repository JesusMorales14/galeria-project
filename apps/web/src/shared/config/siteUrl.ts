/**
 * URL pública del sitio, para URLs absolutas (Open Graph, JSON-LD, canonical).
 * En Vercel se usa el dominio de producción; en local, localhost.
 */
export function siteUrl(env: Record<string, string | undefined> = process.env): URL {
  const explicit = env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(`http://localhost:${env.PORT ?? 3000}`);
}
