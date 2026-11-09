import { describe, expect, it } from "vitest";
import { isActivePath } from "./navigation";

describe("isActivePath", () => {
  it("marca la ruta exacta y sus subrutas", () => {
    expect(isActivePath("/colecciones", "/colecciones")).toBe(true);
    expect(isActivePath("/colecciones/abc", "/colecciones")).toBe(true);
  });

  it("no confunde rutas con el mismo prefijo", () => {
    expect(isActivePath("/buscarlo", "/buscar")).toBe(false);
  });
});
