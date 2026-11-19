export const DEFAULT_AFTER_SIGN_IN = "/cuenta";

/**
 * Destino tras iniciar sesión, a partir de `?next=`. Solo acepta rutas internas:
 * evita redirecciones abiertas (`//evil.com`, `https://evil.com`, `/\evil.com`).
 */
export function safeRedirectPath(next: unknown, fallback: string = DEFAULT_AFTER_SIGN_IN): string {
  if (typeof next !== "string" || !next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  try {
    const url = new URL(next, "http://galeria.local");
    if (url.origin !== "http://galeria.local") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
