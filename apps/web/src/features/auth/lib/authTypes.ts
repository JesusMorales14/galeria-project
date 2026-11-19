import type { AccessClaims, RefreshClaims, VerifyResult } from "@/shared/auth";
import type { RefreshTokenStore } from "./refreshTokens";
import type { PublicUser, UserRepository } from "./users";

export type AuthErrorCode =
  "invalid_credentials" | "email_taken" | "invalid_refresh" | "refresh_reused" | "refresh_race";

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}

export type SessionTokens = { accessToken: string; refreshToken: string };
export type Session = { user: PublicUser; tokens: SessionTokens };

/** Dependencias inyectadas: el servicio no sabe de cookies, Next.js ni dónde se guardan los datos. */
export type AuthDependencies = {
  users: UserRepository;
  refreshTokens: RefreshTokenStore;
  passwords: {
    hash(password: string): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
  };
  tokens: {
    signAccess(claims: AccessClaims): Promise<string>;
    signRefresh(claims: RefreshClaims): Promise<string>;
    verifyRefresh(token: string): Promise<VerifyResult<RefreshClaims>>;
  };
  newId(): string;
  now(): number;
};
