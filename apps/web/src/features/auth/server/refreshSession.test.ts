// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { AuthError } from "../lib/authService";
import { refreshSession } from "./refreshSession";

const refresh = vi.hoisted(() => vi.fn());
vi.mock("./container", () => ({ authService: async () => ({ refresh }) }));

const session = {
  user: { id: "u", name: "Ana", email: "a@b.co", createdAt: "" },
  tokens: { accessToken: "acceso-nuevo", refreshToken: "refresco-nuevo" },
};

function request(next: string, cookie = "galeria_refresco=viejo") {
  return new NextRequest(`http://localhost/api/auth/refresh?next=${encodeURIComponent(next)}`, {
    headers: { cookie },
  });
}

const cookieValue = (response: Response, name: string) =>
  response.headers
    .getSetCookie()
    .find((header) => header.startsWith(`${name}=`))
    ?.split(";")[0]
    ?.split("=")[1];

describe("GET /api/auth/refresh", () => {
  beforeEach(() => {
    refresh.mockReset();
  });

  it("rota los tokens y vuelve a la página pedida", async () => {
    refresh.mockResolvedValue(session);
    const response = await refreshSession(request("/cuenta?x=1"));

    expect(refresh).toHaveBeenCalledWith("viejo");
    expect(response.headers.get("location")).toBe("http://localhost/cuenta?x=1");
    expect(cookieValue(response, "galeria_acceso")).toBe("acceso-nuevo");
    expect(cookieValue(response, "galeria_refresco")).toBe("refresco-nuevo");
  });

  it("si el token no sirve, borra las cookies y manda a entrar", async () => {
    refresh.mockImplementation(async () => {
      throw new AuthError("refresh_reused");
    });
    const response = await refreshSession(request("/cuenta"));

    expect(response.headers.get("location")).toBe("http://localhost/entrar?next=%2Fcuenta");
    expect(cookieValue(response, "galeria_refresco")).toBe("");
  });

  it("si otra pestaña acaba de refrescar, vuelve sin tocar las cookies", async () => {
    refresh.mockImplementation(async () => {
      throw new AuthError("refresh_race");
    });
    const response = await refreshSession(request("/cuenta"));

    expect(response.headers.get("location")).toBe("http://localhost/cuenta");
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it("sin cookie de refresco no llama al servicio", async () => {
    const response = await refreshSession(request("/cuenta", ""));

    expect(refresh).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toContain("/entrar");
  });

  it("nunca redirige fuera del sitio", async () => {
    refresh.mockResolvedValue(session);
    const response = await refreshSession(request("https://evil.example"));
    expect(response.headers.get("location")).toBe("http://localhost/cuenta");
  });

  it("los fallos inesperados no se ocultan", async () => {
    refresh.mockImplementation(async () => {
      throw new Error("caída");
    });
    await expect(refreshSession(request("/cuenta"))).rejects.toThrow("caída");
  });
});
