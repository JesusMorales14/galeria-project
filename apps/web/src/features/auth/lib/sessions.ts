import { REFRESH_TOKEN_TTL_SECONDS } from "@/shared/auth";
import { AuthError, type AuthDependencies, type Session } from "./authTypes";
import type { RefreshTokenRecord } from "./refreshTokens";
import { toPublicUser, type User } from "./users";

/**
 * Margen para dos pestañas que refrescan a la vez con el mismo token: la segunda no es un
 * robo, solo llegó tarde. Pasado este margen, reutilizar un token revoca toda la familia.
 */
export const REFRESH_RACE_WINDOW_MS = 10_000;

type SessionDependencies = Pick<AuthDependencies, "refreshTokens" | "tokens" | "newId" | "now">;

/** Emisión y rotación de sesiones (par de tokens de acceso y refresco). */
export function createSessionIssuer(deps: SessionDependencies) {
  const { refreshTokens, tokens } = deps;

  async function open(user: User, familyId: string = deps.newId()): Promise<Session> {
    const now = deps.now();
    const tokenId = deps.newId();
    await refreshTokens.prune(now);
    await refreshTokens.issue({
      tokenId,
      familyId,
      userId: user.id,
      expiresAt: now + REFRESH_TOKEN_TTL_SECONDS * 1000,
      usedAt: null,
      revoked: false,
    });
    const [accessToken, refreshToken] = await Promise.all([
      tokens.signAccess({ userId: user.id, name: user.name }),
      tokens.signRefresh({ userId: user.id, tokenId, familyId }),
    ]);
    return { user: toPublicUser(user), tokens: { accessToken, refreshToken } };
  }

  async function rejectReuse(record: RefreshTokenRecord): Promise<never> {
    if (deps.now() - record.usedAt! <= REFRESH_RACE_WINDOW_MS) throw new AuthError("refresh_race");
    await refreshTokens.revokeFamily(record.familyId);
    throw new AuthError("refresh_reused");
  }

  /** Consume un token de refresco (un solo uso) y devuelve su registro. */
  async function consume(refreshToken: string) {
    const verified = await tokens.verifyRefresh(refreshToken);
    if (!verified.ok) throw new AuthError("invalid_refresh");
    const record = await refreshTokens.find(verified.claims.tokenId);
    if (!record || record.revoked) throw new AuthError("invalid_refresh");
    if (record.usedAt !== null) return rejectReuse(record);
    // Compare-and-set: si otra petición lo consumió justo ahora, esta pierde la carrera.
    if (!(await refreshTokens.markUsed(record.tokenId, deps.now()))) {
      throw new AuthError("refresh_race");
    }
    return record;
  }

  return { open, consume };
}
