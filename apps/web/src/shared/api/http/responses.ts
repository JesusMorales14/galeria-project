import { AicApiError, AicContractError, AicRateLimitError } from "@galeria/api-client";

/** La CDN de Vercel guarda la respuesta 1 hora y la sirve vieja mientras revalida. */
const SHARED_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return Response.json(body, {
    ...init,
    headers: { "Cache-Control": SHARED_CACHE, ...init?.headers },
  });
}

function errorBody(error: string, status: number, headers?: HeadersInit): Response {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/** Traduce errores del cliente del museo a respuestas HTTP propias, sin detalles internos. */
export function errorToResponse(error: unknown): Response {
  if (error instanceof AicRateLimitError) {
    return errorBody("rate_limited", 503, { "Retry-After": String(error.retryAfterSeconds ?? 60) });
  }
  if (error instanceof AicContractError || error instanceof AicApiError) {
    return errorBody("upstream_error", 502);
  }
  return errorBody("internal_error", 500);
}

export function badRequest(error: string): Response {
  return errorBody(error, 400);
}
