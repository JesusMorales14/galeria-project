import { z } from "zod";
import { DEFAULT_BASE_URL } from "@galeria/api-client";

const envSchema = z.object({
  AIC_API_BASE_URL: z.url().default(DEFAULT_BASE_URL),
  /** Servidor de imágenes al que el proxy /api/iiif pide las obras. */
  AIC_IIIF_BASE_URL: z.url().default("https://www.artic.edu/iiif/2"),
  AIC_USER_AGENT: z
    .string()
    .min(1)
    .default("galeria (https://github.com/JesusMorales14/galeria-project)"),
});

export type ServerEnv = z.infer<typeof envSchema>;

/** Variables de entorno del servidor, validadas. Falla pronto si alguna es inválida. */
export function readServerEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  return envSchema.parse(source);
}
