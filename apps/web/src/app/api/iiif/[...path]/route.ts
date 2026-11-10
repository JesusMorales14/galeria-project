import { fetchIiifImage, parseIiifPath, readServerEnv } from "@/shared/api";

const env = readServerEnv();

/** Una imagen por id y ancho casi nunca cambia: la CDN la guarda 30 días; el navegador, 1 día. */
const IMAGE_CACHE = "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800";

/**
 * GET /api/iiif/:id/full/:ancho,/0/default.jpg
 * Proxy de imágenes: el servidor pide la imagen al museo y la sirve desde nuestro dominio
 * (el servidor IIIF del museo responde 403 a los navegadores que piden desde otra web).
 */
export async function GET(_request: Request, context: RouteContext<"/api/iiif/[...path]">) {
  const image = parseIiifPath((await context.params).path);
  if (!image) return Response.json({ error: "invalid_image" }, { status: 400 });

  const result = await fetchIiifImage(image, {
    baseUrl: env.AIC_IIIF_BASE_URL,
    userAgent: env.AIC_USER_AGENT,
  });
  if (!result.ok) {
    return new Response(null, { status: result.status, headers: { "Cache-Control": "no-store" } });
  }
  return new Response(result.body, {
    headers: { "Content-Type": result.contentType, "Cache-Control": IMAGE_CACHE },
  });
}
