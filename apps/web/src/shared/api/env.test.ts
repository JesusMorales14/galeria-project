import { describe, expect, it } from "vitest";
import { readServerEnv } from "./env";

describe("readServerEnv", () => {
  it("usa la API pública del museo por defecto", () => {
    expect(readServerEnv({}).AIC_API_BASE_URL).toBe("https://api.artic.edu/api/v1");
  });

  it("permite apuntar a otra API (por ejemplo, un mock en e2e)", () => {
    expect(
      readServerEnv({ AIC_API_BASE_URL: "http://localhost:4010/api/v1" }).AIC_API_BASE_URL,
    ).toBe("http://localhost:4010/api/v1");
  });

  it("rechaza una URL inválida", () => {
    expect(() => readServerEnv({ AIC_API_BASE_URL: "no-es-url" })).toThrow();
  });
});
