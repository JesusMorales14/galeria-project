// Primitivas de sesión sin dominio: firmar y verificar tokens, cookies y redirecciones seguras.
// Las usan proxy.ts (sin estado, antes de renderizar) y la feature auth.
export { decideAccess, GUEST_ONLY_PATHS, PROTECTED_PATHS, type AccessRequest } from "./access";
export { ACCESS_COOKIE, expiredSessionCookies, REFRESH_COOKIE, sessionCookies } from "./cookies";
export { isProduction, readAuthSecret } from "./env";
export { DEFAULT_AFTER_SIGN_IN, safeRedirectPath } from "./safeRedirect";
export {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  type AccessClaims,
  type RefreshClaims,
  type VerifyResult,
} from "./tokens";
