// @vitest-environment node
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/shared/auth";
import { createTestDatabase } from "../../../../test/pglite";
import { AuthError, createAuthService } from "./authService";
import {
  createPostgresRefreshTokenStore,
  createPostgresUserRepository,
  type SqlClient,
} from "./postgres";

const secret = "p".repeat(40);

/**
 * Una instancia del servicio: lo que tendría cada réplica, o el servidor antes y después
 * de un redespliegue. Todas comparten solo la base de datos.
 */
function instance(db: SqlClient) {
  return createAuthService({
    users: createPostgresUserRepository(db),
    refreshTokens: createPostgresRefreshTokenStore(db),
    passwords: {
      hash: async (password) => `hash:${password}`,
      verify: async (password, hash) => hash === `hash:${password}`,
    },
    tokens: {
      signAccess: (claims) => signAccessToken(claims, { secret }),
      signRefresh: (claims) => signRefreshToken(claims, { secret }),
      verifyRefresh: (token) => verifyRefreshToken(token, { secret }),
    },
    newId: randomUUID,
    now: Date.now,
  });
}

const codeOf = (promise: Promise<unknown>) =>
  promise.then(
    () => "sin error",
    (error: unknown) => (error instanceof AuthError ? error.code : String(error)),
  );

describe("servicio de autenticación sobre Postgres (varias réplicas y redespliegues)", () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>;
  beforeAll(async () => {
    database = await createTestDatabase();
  }, 60_000);
  afterAll(() => database.close());

  const ada = { name: "Ada", email: "ada@example.com", password: "una frase larga" };

  it("la cuenta y la sesión sobreviven a un redespliegue (instancia nueva)", async () => {
    const before = instance(database.client);
    const { tokens } = await before.signUp(ada);

    const after = instance(database.client); // proceso nuevo: memoria vacía
    const renewed = await after.refresh(tokens.refreshToken);

    expect(renewed.user.email).toBe(ada.email);
    expect((await after.signIn(ada)).user.name).toBe("Ada");
  });

  it("una sesión abierta en una réplica se renueva en otra", async () => {
    const [replicaA, replicaB] = [instance(database.client), instance(database.client)];
    const { tokens } = await replicaA.signIn(ada);

    await expect(replicaB.refresh(tokens.refreshToken)).resolves.toBeDefined();
  });

  it("dos réplicas que reciben el mismo token a la vez no abren dos sesiones", async () => {
    const [replicaA, replicaB] = [instance(database.client), instance(database.client)];
    const { tokens } = await replicaA.signIn(ada);

    const results = await Promise.all([
      codeOf(replicaA.refresh(tokens.refreshToken)),
      codeOf(replicaB.refresh(tokens.refreshToken)),
    ]);

    expect(results.sort()).toEqual(["refresh_race", "sin error"]);
  });

  it("un correo registrado en una réplica no se puede registrar en otra", async () => {
    expect(await codeOf(instance(database.client).signUp(ada))).toBe("email_taken");
  });

  it("cerrar sesión en todas partes afecta a todas las réplicas", async () => {
    const [replicaA, replicaB] = [instance(database.client), instance(database.client)];
    const { user, tokens } = await replicaA.signIn(ada);

    await replicaB.signOutEverywhere(user.id);

    expect(await codeOf(replicaA.refresh(tokens.refreshToken))).toBe("invalid_refresh");
  });
});
