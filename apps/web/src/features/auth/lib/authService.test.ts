// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/shared/auth";
import {
  AuthError,
  createAuthService,
  REFRESH_RACE_WINDOW_MS,
  type AuthService,
} from "./authService";
import { createMemoryRefreshTokenStore } from "./refreshTokens";
import { createMemoryUserRepository } from "./users";

const secret = "t".repeat(40);

function setup() {
  let clock = Date.parse("2026-11-17T10:00:00Z");
  let sequence = 0;
  const hashed: string[] = [];
  const service = createAuthService({
    users: createMemoryUserRepository(),
    refreshTokens: createMemoryRefreshTokenStore(),
    // Contraseñas falsas y rápidas: el hash real (scrypt) tiene su propio test.
    passwords: {
      hash: async (password) => {
        hashed.push(password);
        return `hash:${password}`;
      },
      verify: async (password, hash) => hash === `hash:${password}`,
    },
    tokens: {
      signAccess: (claims) => signAccessToken(claims, { secret, now: new Date(clock) }),
      signRefresh: (claims) => signRefreshToken(claims, { secret, now: new Date(clock) }),
      verifyRefresh: (token) => verifyRefreshToken(token, { secret, now: new Date(clock) }),
    },
    newId: () => `id-${++sequence}`,
    now: () => clock,
  });
  return { service, hashed, advance: (ms: number) => (clock += ms) };
}

const ana = { name: "Ana", email: "ana@example.com", password: "una-clave-larga" };

const codeOf = (promise: Promise<unknown>) =>
  promise.then(
    () => "sin error",
    (error: unknown) => (error instanceof AuthError ? error.code : String(error)),
  );

describe("servicio de autenticación", () => {
  let ctx: ReturnType<typeof setup>;
  let service: AuthService;

  beforeEach(() => {
    ctx = setup();
    service = ctx.service;
  });

  it("registra una cuenta y abre sesión sin exponer el hash de la contraseña", async () => {
    const session = await service.signUp(ana);

    expect(session.user).toEqual({
      id: "id-1",
      name: "Ana",
      email: "ana@example.com",
      createdAt: "2026-11-17T10:00:00.000Z",
    });
    expect(session.tokens.accessToken).toBeTruthy();
    expect(JSON.stringify(session)).not.toContain("hash:");
  });

  it("no permite dos cuentas con el mismo correo", async () => {
    await service.signUp(ana);
    expect(await codeOf(service.signUp(ana))).toBe("email_taken");
  });

  it("entra con la contraseña correcta", async () => {
    await service.signUp(ana);
    const session = await service.signIn({ email: ana.email, password: ana.password });
    expect(session.user.name).toBe("Ana");
  });

  it("da el mismo error si el correo no existe o la contraseña no coincide", async () => {
    await service.signUp(ana);
    const wrongPassword = await codeOf(service.signIn({ email: ana.email, password: "otra" }));
    const unknownEmail = await codeOf(service.signIn({ email: "x@x.com", password: "otra" }));

    expect(wrongPassword).toBe("invalid_credentials");
    expect(unknownEmail).toBe("invalid_credentials");
  });

  it("verifica una contraseña señuelo si el correo no existe (mismo coste, sin pistas)", async () => {
    await codeOf(service.signIn({ email: "nadie@example.com", password: "x" }));
    expect(ctx.hashed).toContain("galeria-señuelo");
  });

  it("rota el token de refresco: emite uno nuevo y el anterior deja de servir", async () => {
    const first = await service.signUp(ana);
    const second = await service.refresh(first.tokens.refreshToken);

    expect(second.tokens.refreshToken).not.toBe(first.tokens.refreshToken);
    expect(await codeOf(service.refresh(second.tokens.refreshToken))).toBe("sin error");
  });

  it("si un token ya usado vuelve a aparecer, revoca toda la sesión (robo detectado)", async () => {
    const first = await service.signUp(ana);
    const second = await service.refresh(first.tokens.refreshToken);
    ctx.advance(REFRESH_RACE_WINDOW_MS + 1);

    expect(await codeOf(service.refresh(first.tokens.refreshToken))).toBe("refresh_reused");
    // El token legítimo también queda revocado: quien lo robó no conserva la sesión.
    expect(await codeOf(service.refresh(second.tokens.refreshToken))).toBe("invalid_refresh");
  });

  it("dos pestañas que refrescan a la vez no cierran la sesión", async () => {
    const first = await service.signUp(ana);
    await service.refresh(first.tokens.refreshToken);

    expect(await codeOf(service.refresh(first.tokens.refreshToken))).toBe("refresh_race");
  });

  it("rechaza tokens de refresco falsos", async () => {
    expect(await codeOf(service.refresh("falso"))).toBe("invalid_refresh");
  });

  it("cerrar sesión revoca esa sesión y no las demás", async () => {
    await service.signUp(ana);
    const laptop = await service.signIn(ana);
    const phone = await service.signIn(ana);

    await service.signOut(laptop.tokens.refreshToken);

    expect(await codeOf(service.refresh(laptop.tokens.refreshToken))).toBe("invalid_refresh");
    expect(await codeOf(service.refresh(phone.tokens.refreshToken))).toBe("sin error");
  });

  it("cuenta las sesiones abiertas y las cierra todas a la vez", async () => {
    const { user } = await service.signUp(ana);
    await service.signIn(ana);
    expect(await service.activeSessions(user.id)).toBe(2);

    await service.signOutEverywhere(user.id);
    expect(await service.activeSessions(user.id)).toBe(0);
  });

  it("cerrar sesión sin token o con uno inválido no falla", async () => {
    await expect(service.signOut(undefined)).resolves.toBeUndefined();
    await expect(service.signOut("basura")).resolves.toBeUndefined();
  });

  it("devuelve la cuenta pública por id", async () => {
    const { user } = await service.signUp(ana);
    expect(await service.getUser(user.id)).toEqual(user);
    expect(await service.getUser("no-existe")).toBeNull();
  });
});
