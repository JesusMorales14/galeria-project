// @vitest-environment node
import { describe, expect, it } from "vitest";
import { expiredSessionCookies, sessionCookies } from "./cookies";
import { readAuthSecret } from "./env";
import { safeRedirectPath } from "./safeRedirect";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./tokens";

const secret = "s".repeat(40);
const now = new Date("2026-11-17T10:00:00Z");
const later = (seconds: number) => new Date(now.getTime() + seconds * 1000);

describe("tokens de acceso", () => {
  it("firma y verifica los datos mínimos de la sesión", async () => {
    const token = await signAccessToken({ userId: "u1", name: "Ana" }, { secret, now });
    const result = await verifyAccessToken(token, { secret, now });
    expect(result).toEqual({ ok: true, claims: { userId: "u1", name: "Ana" } });
  });

  it("caduca a los 15 minutos", async () => {
    const token = await signAccessToken({ userId: "u1", name: "Ana" }, { secret, now });
    const result = await verifyAccessToken(token, {
      secret,
      now: later(ACCESS_TOKEN_TTL_SECONDS + 1),
    });
    expect(result).toEqual({ ok: false, reason: "expired" });
  });

  it("rechaza un token firmado con otro secreto (no se pueden fabricar sesiones)", async () => {
    const token = await signAccessToken({ userId: "u1", name: "Ana" }, { secret: "x".repeat(40) });
    expect(await verifyAccessToken(token, { secret })).toEqual({ ok: false, reason: "invalid" });
  });

  it("rechaza texto que no es un token", async () => {
    expect(await verifyAccessToken("no-es-un-jwt", { secret })).toEqual({
      ok: false,
      reason: "invalid",
    });
  });
});

describe("tokens de refresco", () => {
  const claims = { userId: "u1", tokenId: "t1", familyId: "f1" };

  it("lleva su identificador y su familia para poder rotarlo", async () => {
    const token = await signRefreshToken(claims, { secret, now });
    expect(await verifyRefreshToken(token, { secret, now })).toEqual({ ok: true, claims });
  });

  it("un token de refresco no sirve como token de acceso, ni al revés", async () => {
    const refresh = await signRefreshToken(claims, { secret, now });
    const access = await signAccessToken({ userId: "u1", name: "Ana" }, { secret, now });

    expect((await verifyAccessToken(refresh, { secret, now })).ok).toBe(false);
    expect((await verifyRefreshToken(access, { secret, now })).ok).toBe(false);
  });
});

describe("readAuthSecret", () => {
  it("en desarrollo usa un secreto local si no hay uno configurado", () => {
    expect(readAuthSecret({ NODE_ENV: "development" }).length).toBeGreaterThanOrEqual(32);
  });

  it("en producción exige un secreto largo", () => {
    expect(() => readAuthSecret({ NODE_ENV: "production" })).toThrow();
    expect(() => readAuthSecret({ NODE_ENV: "production", AUTH_SECRET: "corto" })).toThrow(
      /32 caracteres/,
    );
    expect(readAuthSecret({ NODE_ENV: "production", AUTH_SECRET: secret })).toBe(secret);
  });
});

describe("cookies de sesión", () => {
  it("son HttpOnly y SameSite=Lax, y duran lo mismo que su token", () => {
    const [access, refresh] = sessionCookies({ accessToken: "a", refreshToken: "r" });
    expect(access).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", maxAge: 900 });
    expect(refresh?.maxAge).toBe(7 * 24 * 60 * 60);
  });

  it("para cerrar sesión se envían vacías y caducadas", () => {
    expect(expiredSessionCookies().every((cookie) => cookie.maxAge === 0)).toBe(true);
  });
});

describe("safeRedirectPath", () => {
  it.each([
    ["/obra/1?zoom=2#info", "/obra/1?zoom=2#info"],
    ["/colecciones", "/colecciones"],
  ])("acepta rutas internas: %s", (input, expected) => {
    expect(safeRedirectPath(input)).toBe(expected);
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "",
    undefined,
    42,
  ])("rechaza destinos externos o inválidos: %s", (input) => {
    expect(safeRedirectPath(input)).toBe("/cuenta");
  });
});
