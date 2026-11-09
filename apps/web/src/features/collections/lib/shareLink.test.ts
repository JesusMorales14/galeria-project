import { describe, expect, it } from "vitest";
import { buildShareHref, parseSharedCollection } from "./shareLink";

describe("buildShareHref", () => {
  it("codifica nombre y obras en la URL", () => {
    expect(buildShareHref({ name: "Para mi sala", artworkIds: [123, 456, 789] })).toBe(
      "/coleccion?nombre=Para+mi+sala&obras=123%2C456%2C789",
    );
  });
});

describe("parseSharedCollection", () => {
  it("lee un enlace válido", () => {
    expect(parseSharedCollection({ nombre: "Para mi sala", obras: "123,456" })).toEqual({
      ok: true,
      collection: { name: "Para mi sala", artworkIds: [123, 456] },
    });
  });

  it("quita duplicados y usa un nombre por defecto si falta", () => {
    expect(parseSharedCollection({ obras: "1,1,2" })).toEqual({
      ok: true,
      collection: { name: "Colección compartida", artworkIds: [1, 2] },
    });
  });

  it("detecta un enlace sin obras", () => {
    expect(parseSharedCollection({ nombre: "Vacía" })).toEqual({ ok: false, reason: "empty" });
  });

  it("detecta un enlace manipulado sin lanzar errores", () => {
    for (const obras of [
      "abc",
      "1,,2",
      "1;DROP TABLE",
      "-5",
      String(
        Array(200)
          .fill(1)
          .map((_, i) => i + 1),
      ),
    ]) {
      expect(parseSharedCollection({ obras })).toEqual({ ok: false, reason: "invalid" });
    }
    expect(parseSharedCollection({ obras: "1", nombre: "x".repeat(200) })).toEqual({
      ok: false,
      reason: "invalid",
    });
  });
});
