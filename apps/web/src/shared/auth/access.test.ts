import { describe, expect, it } from "vitest";
import { decideAccess, type AccessRequest } from "./access";

const request = (overrides: Partial<AccessRequest>): AccessRequest => ({
  pathname: "/",
  search: "",
  signedIn: false,
  hasRefreshToken: false,
  ...overrides,
});

describe("decideAccess", () => {
  it("deja pasar las páginas públicas con o sin sesión", () => {
    expect(decideAccess(request({ pathname: "/buscar" }))).toBeNull();
    expect(decideAccess(request({ pathname: "/obra/1", signedIn: true }))).toBeNull();
  });

  it("manda a entrar desde una página protegida, con vuelta a ella", () => {
    expect(decideAccess(request({ pathname: "/cuenta", search: "?tab=1" }))).toBe(
      "/entrar?next=%2Fcuenta%3Ftab%3D1",
    );
  });

  it("si el acceso caducó pero hay refresco, renueva la sesión en vez de pedir la contraseña", () => {
    expect(decideAccess(request({ pathname: "/cuenta", hasRefreshToken: true }))).toBe(
      "/api/auth/refresh?next=%2Fcuenta",
    );
  });

  it("con sesión, la página protegida se sirve", () => {
    expect(decideAccess(request({ pathname: "/cuenta/ajustes", signedIn: true }))).toBeNull();
  });

  it("con sesión, entrar o registrarse lleva directamente al destino", () => {
    expect(decideAccess(request({ pathname: "/entrar", signedIn: true }))).toBe("/cuenta");
    expect(
      decideAccess(
        request({ pathname: "/registro", search: "?next=/colecciones", signedIn: true }),
      ),
    ).toBe("/colecciones");
  });

  it("no redirige fuera del sitio aunque ?next lo pida", () => {
    expect(
      decideAccess(
        request({ pathname: "/entrar", search: "?next=//evil.example", signedIn: true }),
      ),
    ).toBe("/cuenta");
  });

  it("en entrar, sin sesión pero con refresco, intenta recuperar la sesión", () => {
    expect(decideAccess(request({ pathname: "/entrar", hasRefreshToken: true }))).toBe(
      "/api/auth/refresh?next=%2Fcuenta",
    );
    expect(decideAccess(request({ pathname: "/entrar" }))).toBeNull();
  });
});
