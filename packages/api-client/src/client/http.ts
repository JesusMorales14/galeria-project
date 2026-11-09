import type { z } from "zod";
import { AicApiError, AicContractError, AicRateLimitError } from "../errors";

export type HttpConfig = {
  baseUrl: string;
  userAgent: string;
  fetch: typeof fetch;
};

function retryAfter(response: Response): number | null {
  const value = Number(response.headers.get("Retry-After"));
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** GET a la API. Devuelve null en 404; lanza errores tipados en el resto de fallos. */
export async function getJson(
  config: HttpConfig,
  path: string,
  search?: URLSearchParams,
): Promise<unknown> {
  const url = `${config.baseUrl.replace(/\/+$/, "")}${path}${search ? `?${search}` : ""}`;
  const response = await config.fetch(url, {
    headers: { Accept: "application/json", "AIC-User-Agent": config.userAgent },
  });

  if (response.status === 404) return null;
  if (response.status === 429) throw new AicRateLimitError(retryAfter(response));
  if (!response.ok) {
    throw new AicApiError(
      `La API del museo respondió ${response.status} en ${path}`,
      response.status,
    );
  }
  return response.json();
}

/** Valida una respuesta contra su esquema Zod. */
export function parseContract<T extends z.ZodType>(
  schema: T,
  data: unknown,
  label: string,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AicContractError(`Respuesta inesperada de la API en ${label}`, result.error.issues);
  }
  return result.data;
}
