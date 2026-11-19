import { DEFAULT_AFTER_SIGN_IN, safeRedirectPath } from "./safeRedirect";

/** Rutas que exigen sesión y rutas que solo tienen sentido sin ella. */
export const PROTECTED_PATHS = ["/cuenta"] as const;
export const GUEST_ONLY_PATHS = ["/entrar", "/registro"] as const;

const matches = (pathname: string, paths: readonly string[]) =>
  paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export type AccessRequest = {
  pathname: string;
  search: string;
  /** Hay un token de acceso válido (firma y caducidad comprobadas). */
  signedIn: boolean;
  /** Hay un token de refresco (aún sin comprobar: eso lo hace /api/auth/refresh). */
  hasRefreshToken: boolean;
};

const refreshThen = (next: string) => `/api/auth/refresh?next=${encodeURIComponent(next)}`;

/**
 * Decide, antes de renderizar, si una navegación debe redirigirse. Devuelve la ruta de
 * destino o null para dejarla pasar. Es una comprobación optimista y sin estado: las
 * páginas vuelven a verificar la sesión en el servidor (requireUser).
 */
export function decideAccess(request: AccessRequest): string | null {
  const { pathname, search, signedIn, hasRefreshToken } = request;

  if (matches(pathname, GUEST_ONLY_PATHS)) {
    const next = safeRedirectPath(new URLSearchParams(search).get("next"), DEFAULT_AFTER_SIGN_IN);
    if (signedIn) return next;
    // El acceso caducó pero hay refresco: se recupera la sesión sin pedir la contraseña.
    return hasRefreshToken ? refreshThen(next) : null;
  }

  if (matches(pathname, PROTECTED_PATHS) && !signedIn) {
    const returnTo = `${pathname}${search}`;
    if (hasRefreshToken) return refreshThen(returnTo);
    return `/entrar?next=${encodeURIComponent(returnTo)}`;
  }

  return null;
}
