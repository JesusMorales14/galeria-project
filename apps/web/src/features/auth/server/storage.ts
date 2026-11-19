import "server-only";
import pg from "pg";
import {
  createPostgresAttemptStore,
  createPostgresRefreshTokenStore,
  createPostgresUserRepository,
} from "../lib/postgres";
import { createMemoryAttemptStore, type AttemptStore } from "../lib/rateLimiter";
import { createMemoryRefreshTokenStore, type RefreshTokenStore } from "../lib/refreshTokens";
import type { StorageConfig } from "../lib/storageConfig";
import { createMemoryUserRepository, type UserRepository } from "../lib/users";

export type AuthStorage = {
  users: UserRepository;
  refreshTokens: RefreshTokenStore;
  attempts: AttemptStore;
};

function postgresStorage(url: string): AuthStorage {
  // Un pool por proceso. Un error de una conexión ociosa (p. ej. Postgres reiniciado) no debe
  // tumbar el servidor: el pool la descarta y abre otra en la siguiente consulta.
  const pool = new pg.Pool({ connectionString: url, max: 10, idleTimeoutMillis: 30_000 });
  pool.on("error", (error) => console.error("[auth] conexión de Postgres perdida", error.message));
  return {
    users: createPostgresUserRepository(pool),
    refreshTokens: createPostgresRefreshTokenStore(pool),
    attempts: createPostgresAttemptStore(pool),
  };
}

export function createAuthStorage(config: StorageConfig): AuthStorage {
  if (config.kind === "postgres") return postgresStorage(config.url);
  return {
    users: createMemoryUserRepository(),
    refreshTokens: createMemoryRefreshTokenStore(),
    attempts: createMemoryAttemptStore(),
  };
}
