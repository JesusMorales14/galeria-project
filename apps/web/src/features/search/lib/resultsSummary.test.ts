import { describe, expect, it } from "vitest";
import { resultsSummary } from "./resultsSummary";

describe("resultsSummary", () => {
  it("formatea números en español y concuerda en singular y plural", () => {
    expect(resultsSummary(1234, 2, 52)).toBe("1234 obras encontradas · página 2 de 52");
    expect(resultsSummary(1, 1, 1)).toBe("1 obra encontrada");
    expect(resultsSummary(0, 1, 0)).toBe("No se encontraron obras");
  });

  it("usa separador de miles a partir de 10 000", () => {
    expect(resultsSummary(12500, 1, 416)).toBe("12.500 obras encontradas · página 1 de 416");
  });
});
