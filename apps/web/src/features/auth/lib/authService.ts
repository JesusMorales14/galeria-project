import type { SignInInput, SignUpInput } from "./credentials";
import { AuthError, type AuthDependencies, type Session } from "./authTypes";
import { createSessionIssuer } from "./sessions";
import { toPublicUser, type PublicUser, type User } from "./users";

export {
  AuthError,
  type AuthDependencies,
  type AuthErrorCode,
  type Session,
  type SessionTokens,
} from "./authTypes";
export { REFRESH_RACE_WINDOW_MS } from "./sessions";

/** Casos de uso de la autenticación. */
export function createAuthService(deps: AuthDependencies) {
  const { users, refreshTokens, passwords, tokens } = deps;
  const sessions = createSessionIssuer(deps);
  // Hash señuelo: si el correo no existe se verifica igualmente, para no revelar con el
  // tiempo de respuesta qué correos tienen cuenta.
  let decoyHash: Promise<string> | undefined;
  const decoy = () => (decoyHash ??= passwords.hash("galeria-señuelo"));

  return {
    async signUp({ name, email, password }: SignUpInput): Promise<Session> {
      const user: User = {
        id: deps.newId(),
        name,
        email,
        passwordHash: await passwords.hash(password),
        createdAt: new Date(deps.now()).toISOString(),
      };
      // insert es atómico: el índice único del correo decide si ya existía.
      if (!(await users.insert(user))) throw new AuthError("email_taken");
      return sessions.open(user);
    },

    async signIn({ email, password }: SignInInput): Promise<Session> {
      const user = await users.findByEmail(email);
      const valid = await passwords.verify(password, user?.passwordHash ?? (await decoy()));
      if (!user || !valid) throw new AuthError("invalid_credentials");
      return sessions.open(user);
    },

    /** Rotación: consume el token de refresco y emite un par nuevo de la misma familia. */
    async refresh(refreshToken: string): Promise<Session> {
      const record = await sessions.consume(refreshToken);
      const user = await users.findById(record.userId);
      if (!user) throw new AuthError("invalid_refresh");
      return sessions.open(user, record.familyId);
    },

    /** Cierra esta sesión. Un token inválido o caducado no es un error: ya está cerrada. */
    async signOut(refreshToken: string | undefined) {
      if (!refreshToken) return;
      const verified = await tokens.verifyRefresh(refreshToken);
      if (verified.ok) await refreshTokens.revokeFamily(verified.claims.familyId);
    },

    signOutEverywhere: (userId: string) => refreshTokens.revokeUser(userId),

    async getUser(userId: string): Promise<PublicUser | null> {
      const user = await users.findById(userId);
      return user ? toPublicUser(user) : null;
    },

    activeSessions: (userId: string) => refreshTokens.activeFamilies(userId, deps.now()),
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
