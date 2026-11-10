import { parseIiifPath, readServerEnv } from "@/shared/api";

const env = readServerEnv();

/** Una imagen por id y ancho casi nunca cambia: la CDN la guarda 30 días. */
const IMAGE_CACHE = "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800";

/**
 * GET /api/iiif/:id/full/:ancho,/0/default.jpg
 * Proxy de imágenes: el servidor pide la imagen al museo y la sirve desde nuestro dominio.
 */
export async function GET(_request: Request, context: RouteContext<"/api/iiif/[...path]">) {
  const image = parseIiifPath((await context.params).path);
  if (!image) return Response.json({ error: "invalid_image" }, { status: 400 });

  const base = env.AIC_IIIF_BASE_URL.replace(/\/+$/, "");
  const upstream = await fetch(`${base}/${image.imageId}/full/${image.width},/0/default.jpg`, {
    headers: { Accept: "image/jpeg,image/*", "AIC-User-Agent": env.AIC_USER_AGENT },
  }).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    const status = upstream?.status === 404 ? 404 : 502;
    return new Response(null, { status, headers: { "Cache-Control": "no-store" } });
  }
  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": IMAGE_CACHE,
    },
  });
}
