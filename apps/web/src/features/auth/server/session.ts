import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  ACCESS_COOKIE,
  expiredSessionCookies,
  REFRESH_COOKIE,
  sessionCookies,
  verifyAccessToken,
} from "@/shared/auth";
import type { SessionTokens } from "../lib/authService";
import type { PublicUser } from "../lib/users";
import { authService } from "./container";

export type SessionUser = { id: string; name: string };

/**
 * Capa de acceso a datos (DAL): única puerta para saber quién hace la petición.
 * proxy.ts filtra pronto, pero no basta: cada lectura protegida vuelve a verificar aquí.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  // Verificar compara la caducidad con la hora actual: es un dato de la petición, no del build.
  await connection();
  const result = await verifyAccessToken(token);
  return result.ok ? { id: result.claims.userId, name: result.claims.name } : null;
}

/** Para páginas protegidas: devuelve la cuenta o manda a entrar (con vuelta a esta página). */
export async function requireUser(returnTo: string): Promise<PublicUser> {
  const session = await getSessionUser();
  const user = session && (await (await authService()).getUser(session.id));
  if (!user) redirect(`/entrar?next=${encodeURIComponent(returnTo)}`);
  return user;
}

export async function readRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function writeSessionCookies(tokens: SessionTokens) {
  const store = await cookies();
  for (const cookie of sessionCookies(tokens)) store.set(cookie);
}

export async function clearSessionCookies() {
  const store = await cookies();
  for (const cookie of expiredSessionCookies()) store.set(cookie);
}
