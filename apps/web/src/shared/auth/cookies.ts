import { isProduction } from "./env";
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from "./tokens";

export const ACCESS_COOKIE = "galeria_acceso";
export const REFRESH_COOKIE = "galeria_refresco";

export type SessionCookie = {
  name: string;
  value: string;
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
};

/**
 * Opciones de las cookies de sesión:
 * - HttpOnly: el JavaScript de la página no puede leerlas (un XSS no roba la sesión).
 * - SameSite=Lax: no viajan en peticiones POST de otros sitios (protección CSRF).
 * - Secure en producción: solo por HTTPS.
 */
function sessionCookie(name: string, value: string, maxAge: number): SessionCookie {
  return {
    name,
    value,
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export function sessionCookies(tokens: { accessToken: string; refreshToken: string }) {
  return [
    sessionCookie(ACCESS_COOKIE, tokens.accessToken, ACCESS_TOKEN_TTL_SECONDS),
    sessionCookie(REFRESH_COOKIE, tokens.refreshToken, REFRESH_TOKEN_TTL_SECONDS),
  ];
}

/** Cookies vacías y caducadas: así se borran en el navegador. */
export function expiredSessionCookies() {
  return [sessionCookie(ACCESS_COOKIE, "", 0), sessionCookie(REFRESH_COOKIE, "", 0)];
}
