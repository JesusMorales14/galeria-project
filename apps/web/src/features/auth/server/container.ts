import "server-only";
import { randomUUID } from "node:crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/shared/auth";
import { createAuthService, type AuthService } from "../lib/authService";
import { DEMO_ACCOUNT } from "../lib/demoAccount";
import { hashPassword, verifyPassword } from "../lib/password";
import { createRateLimiter, type RateLimiter } from "../lib/rateLimiter";
import { readStorageConfig } from "../lib/storageConfig";
import { createAuthStorage } from "./storage";

/**
 * Raíz de composición: el único sitio que decide qué implementaciones se usan.
 * Se guarda en globalThis para sobrevivir a la recarga en caliente de `next dev`
 * (si no, cada cambio de código abriría otro pool de conexiones).
 */
type AuthContainer = { service: AuthService; signInLimiter: RateLimiter };

const globalStore = globalThis as typeof globalThis & {
  __galeriaAuth?: Promise<AuthContainer>;
};

async function build(): Promise<AuthContainer> {
  const storage = createAuthStorage(readStorageConfig());
  // La cuenta de demostración existe siempre; insert no la duplica si ya está guardada.
  await storage.users.insert({
    ...DEMO_ACCOUNT,
    passwordHash: await hashPassword(DEMO_ACCOUNT.password),
  });
  return {
    service: createAuthService({
      users: storage.users,
      refreshTokens: storage.refreshTokens,
      passwords: { hash: hashPassword, verify: verifyPassword },
      tokens: {
        signAccess: signAccessToken,
        signRefresh: signRefreshToken,
        verifyRefresh: verifyRefreshToken,
      },
      newId: randomUUID,
      now: Date.now,
    }),
    // 5 intentos cada 15 minutos por IP y correo, contados en el almacén compartido.
    signInLimiter: createRateLimiter({
      limit: 5,
      windowMs: 15 * 60 * 1000,
      store: storage.attempts,
    }),
  };
}

function container(): Promise<AuthContainer> {
  globalStore.__galeriaAuth ??= build().catch((error: unknown) => {
    globalStore.__galeriaAuth = undefined; // un fallo al arrancar (p. ej. la BD) se reintenta
    throw error;
  });
  return globalStore.__galeriaAuth;
}

export const authService = async () => (await container()).service;
export const signInLimiter = async () => (await container()).signInLimiter;
