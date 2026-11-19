/**
 * URL pública del sitio, para URLs absolutas (Open Graph, JSON-LD, canonical).
 * Orden: NEXT_PUBLIC_SITE_URL (explícita), el dominio público de Railway o el de Vercel
 * (los define cada plataforma) y, en local, localhost.
 */
export function siteUrl(env: Record<string, string | undefined> = process.env): URL {
  const explicit = env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const railway = env.RAILWAY_PUBLIC_DOMAIN;
  if (railway) return new URL(`https://${railway}`);
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(`http://localhost:${env.PORT ?? 3000}`);
}
