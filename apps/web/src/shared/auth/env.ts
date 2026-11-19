import { z } from "zod";

/** Solo para desarrollo y tests. En producción, AUTH_SECRET es obligatorio. */
const DEVELOPMENT_SECRET = "galeria-dev-secret-no-usar-en-produccion-0123456789";

const secretSchema = z
  .string()
  .min(32, "AUTH_SECRET debe tener al menos 32 caracteres (openssl rand -base64 48).");

type Source = Record<string, string | undefined>;

/**
 * Secreto con el que se firman los tokens. Falla pronto en producción si falta:
 * un secreto por defecto en producción permitiría a cualquiera fabricar sesiones.
 */
export function readAuthSecret(source: Source = process.env): string {
  const value = source.AUTH_SECRET;
  if (!value && source.NODE_ENV !== "production") return DEVELOPMENT_SECRET;
  return secretSchema.parse(value);
}

/** Las cookies solo viajan por HTTPS en producción (en local se usa http://localhost). */
export const isProduction = (source: Source = process.env) => source.NODE_ENV === "production";
