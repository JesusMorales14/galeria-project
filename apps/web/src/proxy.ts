import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, decideAccess, REFRESH_COOKIE, verifyAccessToken } from "@/shared/auth";

/**
 * Filtro optimista antes de renderizar: solo comprueba la firma del token de acceso
 * (sin estado, sin base de datos). La verificación definitiva la hace cada página
 * protegida en el servidor (requireUser). Ver docs/adr/0009.
 */
export async function proxy(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const signedIn = access ? (await verifyAccessToken(access)).ok : false;

  const destination = decideAccess({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    signedIn,
    hasRefreshToken: request.cookies.has(REFRESH_COOKIE),
  });

  return destination
    ? NextResponse.redirect(new URL(destination, request.url))
    : NextResponse.next();
}

export const config = {
  matcher: ["/cuenta/:path*", "/entrar", "/registro"],
};
