import type { IiifRequest } from "./iiifPath";

type Options = { baseUrl: string; userAgent: string; retries?: number };
type Result =
  | { ok: true; body: ReadableStream<Uint8Array>; contentType: string }
  | { ok: false; status: 404 | 502 };

/** Un intento: la imagen, un 404 definitivo o "retry" si merece la pena reintentar. */
async function attempt(url: string, userAgent: string): Promise<Result | "retry"> {
  const response = await fetch(url, {
    headers: { Accept: "image/jpeg,image/*", "AIC-User-Agent": userAgent },
  }).catch(() => null);
  if (response?.status === 404) return { ok: false, status: 404 };
  const contentType = response?.headers.get("Content-Type") ?? "";
  if (response?.ok && response.body && contentType.startsWith("image/")) {
    return { ok: true, body: response.body, contentType };
  }
  return "retry";
}

/**
 * Pide una imagen al servidor IIIF. Reintenta una vez ante fallos puntuales y solo acepta
 * respuestas que son imágenes: una página de desafío de Cloudflare nunca se cachea como imagen.
 */
export async function fetchIiifImage(image: IiifRequest, options: Options): Promise<Result> {
  const base = options.baseUrl.replace(/\/+$/, "");
  const url = `${base}/${image.imageId}/full/${image.width},/0/default.jpg`;
  const tries = 1 + (options.retries ?? 1);

  for (let i = 0; i < tries; i += 1) {
    const result = await attempt(url, options.userAgent);
    if (result !== "retry") return result;
  }
  return { ok: false, status: 502 };
}
