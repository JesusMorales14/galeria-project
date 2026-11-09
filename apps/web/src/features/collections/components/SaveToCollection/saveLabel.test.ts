import { describe, expect, it } from "vitest";
import { saveLabel } from "./saveLabel";

describe("saveLabel", () => {
  it("invita a guardar o dice dónde está guardada", () => {
    expect(saveLabel(0)).toBe("Guardar en colección");
    expect(saveLabel(1)).toBe("Guardada en 1 colección");
    expect(saveLabel(3)).toBe("Guardada en 3 colecciones");
  });
});
