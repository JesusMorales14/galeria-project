// @vitest-environment node
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createTestDatabase } from "../../../../test/pglite";
import {
  createPostgresAttemptStore,
  createPostgresRefreshTokenStore,
  createPostgresUserRepository,
} from "./postgres";
import { createMemoryAttemptStore, type AttemptStore } from "./rateLimiter";
import { createMemoryRefreshTokenStore, type RefreshTokenStore } from "./refreshTokens";
import { createMemoryUserRepository, type UserRepository } from "./users";

/*
 * Contrato de almacenamiento: los mismos tests para memoria y para Postgres.
 * Si una implementación nueva los pasa, el servicio de auth funciona con ella.
 */
type Stores = { users: UserRepository; refreshTokens: RefreshTokenStore; attempts: AttemptStore };

const ana = {
  id: "u1",
  name: "Ana",
  email: "ana@example.com",
  passwordHash: "hash",
  createdAt: "2026-11-17T10:00:00.000Z",
};
const token = (tokenId: string, extra: Partial<{ familyId: string; expiresAt: number }> = {}) => ({
  tokenId,
  familyId: "f1",
  userId: "u1",
  expiresAt: Date.parse("2026-11-24T10:00:00Z"),
  usedAt: null,
  revoked: false,
  ...extra,
});
const NOW = Date.parse("2026-11-17T10:00:00Z");

function storageContract(name: string, setup: () => Promise<Stores>) {
  describe(`almacenamiento de cuentas: ${name}`, () => {
    let s: Stores;
    beforeEach(async () => {
      s = await setup();
      await s.users.insert(ana);
    });

    it("guarda y encuentra cuentas por id y por correo", async () => {
      expect(await s.users.findById("u1")).toEqual(ana);
      expect(await s.users.findByEmail("ana@example.com")).toEqual(ana);
      expect(await s.users.findByEmail("nadie@example.com")).toBeNull();
    });

    it("no crea dos cuentas con el mismo correo", async () => {
      expect(await s.users.insert({ ...ana, id: "u2", name: "Otra" })).toBe(false);
      expect((await s.users.findByEmail(ana.email))?.id).toBe("u1");
    });

    it("guarda los tokens de refresco con sus fechas", async () => {
      await s.refreshTokens.issue(token("t1"));
      expect(await s.refreshTokens.find("t1")).toEqual(token("t1"));
    });

    it("dos consumos simultáneos del mismo token: solo uno gana", async () => {
      await s.refreshTokens.issue(token("t1"));
      const results = await Promise.all([
        s.refreshTokens.markUsed("t1", NOW),
        s.refreshTokens.markUsed("t1", NOW),
      ]);
      expect(results.filter(Boolean)).toHaveLength(1);
      expect((await s.refreshTokens.find("t1"))?.usedAt).toBe(NOW);
    });

    it("un token revocado no se puede consumir", async () => {
      await s.refreshTokens.issue(token("t1"));
      await s.refreshTokens.revokeFamily("f1");
      expect(await s.refreshTokens.markUsed("t1", NOW)).toBe(false);
    });

    it("cuenta sesiones abiertas y las revoca por familia o por persona", async () => {
      await s.refreshTokens.issue(token("t1", { familyId: "portatil" }));
      await s.refreshTokens.issue(token("t2", { familyId: "movil" }));
      expect(await s.refreshTokens.activeFamilies("u1", NOW)).toBe(2);

      await s.refreshTokens.revokeFamily("portatil");
      expect(await s.refreshTokens.activeFamilies("u1", NOW)).toBe(1);

      await s.refreshTokens.revokeUser("u1");
      expect(await s.refreshTokens.activeFamilies("u1", NOW)).toBe(0);
    });

    it("olvida los tokens caducados", async () => {
      await s.refreshTokens.issue(token("viejo", { expiresAt: NOW - 1 }));
      await s.refreshTokens.issue(token("vigente"));
      await s.refreshTokens.prune(NOW);
      expect(await s.refreshTokens.find("viejo")).toBeNull();
      expect(await s.refreshTokens.find("vigente")).not.toBeNull();
    });

    it("cuenta intentos de acceso en una ventana, los limpia y los olvida", async () => {
      await s.attempts.record("ip:ana", NOW - 5000);
      await s.attempts.record("ip:ana", NOW - 1000);
      await s.attempts.record("ip:otra", NOW);

      expect(await s.attempts.countSince("ip:ana", NOW - 3000)).toEqual({
        count: 1,
        oldest: NOW - 1000,
      });
      await s.attempts.prune(NOW - 3000);
      expect((await s.attempts.countSince("ip:ana", 0)).count).toBe(1);
      await s.attempts.clear("ip:ana");
      expect(await s.attempts.countSince("ip:ana", 0)).toEqual({ count: 0, oldest: null });
      expect((await s.attempts.countSince("ip:otra", 0)).count).toBe(1);
    });
  });
}

storageContract("memoria", async () => ({
  users: createMemoryUserRepository(),
  refreshTokens: createMemoryRefreshTokenStore(),
  attempts: createMemoryAttemptStore(),
}));

describe("Postgres", () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>;
  beforeAll(async () => {
    database = await createTestDatabase();
  }, 60_000);
  afterAll(() => database.close());

  it("las migraciones crean el esquema una sola vez", async () => {
    expect(database.applied).toEqual(["0001_cuentas.sql"]);
    expect(await database.migrateAgain()).toEqual([]);
  });

  storageContract("Postgres (PGlite)", async () => {
    await database.reset();
    return {
      users: createPostgresUserRepository(database.client),
      refreshTokens: createPostgresRefreshTokenStore(database.client),
      attempts: createPostgresAttemptStore(database.client),
    };
  });
});
