import { errors, jwtVerify, SignJWT, type JWTPayload } from "jose";
import { readAuthSecret } from "./env";

/**
 * Dos tokens con propósitos distintos (audiencias distintas: uno no sirve como el otro):
 * - Acceso: corto (15 min), sin estado. Lo comprueba proxy.ts en cada navegación.
 * - Refresco: largo (7 días), de un solo uso. Su `jti` se registra en el servidor para
 *   rotarlo y detectar si alguien reutiliza uno robado.
 */
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

const ISSUER = "galeria";
const ACCESS_AUDIENCE = "galeria:acceso";
const REFRESH_AUDIENCE = "galeria:refresco";
const ALGORITHM = "HS256";

export type AccessClaims = { userId: string; name: string };
export type RefreshClaims = { userId: string; tokenId: string; familyId: string };

export type VerifyResult<T> =
  { ok: true; claims: T } | { ok: false; reason: "expired" | "invalid" };

const key = (secret: string) => new TextEncoder().encode(secret);

type SignOptions = { secret?: string; now?: Date };

type JwtSpec = { payload: JWTPayload; audience: string; ttl: number };

function baseJwt({ payload, audience, ttl }: JwtSpec, options: SignOptions) {
  const issuedAt = Math.floor((options.now ?? new Date()).getTime() / 1000);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM, typ: "JWT" })
    .setIssuer(ISSUER)
    .setAudience(audience)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + ttl);
}

export function signAccessToken(claims: AccessClaims, options: SignOptions = {}) {
  return baseJwt(
    { payload: { name: claims.name }, audience: ACCESS_AUDIENCE, ttl: ACCESS_TOKEN_TTL_SECONDS },
    options,
  )
    .setSubject(claims.userId)
    .sign(key(options.secret ?? readAuthSecret()));
}

export function signRefreshToken(claims: RefreshClaims, options: SignOptions = {}) {
  return baseJwt(
    {
      payload: { fam: claims.familyId },
      audience: REFRESH_AUDIENCE,
      ttl: REFRESH_TOKEN_TTL_SECONDS,
    },
    options,
  )
    .setSubject(claims.userId)
    .setJti(claims.tokenId)
    .sign(key(options.secret ?? readAuthSecret()));
}

type VerifyOptions = { secret?: string; now?: Date };

async function verify(token: string, audience: string, options: VerifyOptions) {
  try {
    const { payload } = await jwtVerify(token, key(options.secret ?? readAuthSecret()), {
      issuer: ISSUER,
      audience,
      algorithms: [ALGORITHM],
      currentDate: options.now,
    });
    return { ok: true as const, payload };
  } catch (error) {
    const reason = error instanceof errors.JWTExpired ? "expired" : "invalid";
    return { ok: false as const, reason } satisfies VerifyResult<never>;
  }
}

export async function verifyAccessToken(
  token: string,
  options: VerifyOptions = {},
): Promise<VerifyResult<AccessClaims>> {
  const result = await verify(token, ACCESS_AUDIENCE, options);
  if (!result.ok) return result;
  const { sub, name } = result.payload;
  if (!sub || typeof name !== "string") return { ok: false, reason: "invalid" };
  return { ok: true, claims: { userId: sub, name } };
}

export async function verifyRefreshToken(
  token: string,
  options: VerifyOptions = {},
): Promise<VerifyResult<RefreshClaims>> {
  const result = await verify(token, REFRESH_AUDIENCE, options);
  if (!result.ok) return result;
  const { sub, jti, fam } = result.payload;
  if (!sub || !jti || typeof fam !== "string") return { ok: false, reason: "invalid" };
  return { ok: true, claims: { userId: sub, tokenId: jti, familyId: fam } };
}
