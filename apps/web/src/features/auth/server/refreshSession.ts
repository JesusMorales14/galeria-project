import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_AFTER_SIGN_IN,
  expiredSessionCookies,
  REFRESH_COOKIE,
  safeRedirectPath,
  sessionCookies,
} from "@/shared/auth";
import { AuthError } from "../lib/authService";
import { authService } from "./container";

/**
 * GET /api/auth/refresh?next=/ruta
 * Rota el token de refresco y vuelve a la página que se quería ver. Si el token no sirve,
 * borra las cookies y manda a entrar. Lo invoca proxy.ts cuando el acceso ha caducado.
 */
export async function refreshSession(request: NextRequest): Promise<NextResponse> {
  const next = safeRedirectPath(request.nextUrl.searchParams.get("next"), DEFAULT_AFTER_SIGN_IN);
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url));
  const token = request.cookies.get(REFRESH_COOKIE)?.value;

  try {
    if (!token) throw new AuthError("invalid_refresh");
    const session = await (await authService()).refresh(token);
    const response = to(next);
    for (const cookie of sessionCookies(session.tokens)) response.cookies.set(cookie);
    return response;
  } catch (error) {
    if (!(error instanceof AuthError)) throw error;
    // Otra pestaña acaba de rotar el token: el navegador ya tiene las cookies nuevas.
    if (error.code === "refresh_race") return to(next);
    const response = to(`/entrar?next=${encodeURIComponent(next)}`);
    for (const cookie of expiredSessionCookies()) response.cookies.set(cookie);
    return response;
  }
}
