import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

describe("siteConfig", () => {
  it("identifica el sitio como Galería", () => {
    expect(siteConfig.name).toBe("Galería");
  });

  it("declara el español como idioma del sitio", () => {
    expect(siteConfig.locale).toBe("es");
  });

  it("tiene una descripción no vacía para los metadatos", () => {
    expect(siteConfig.description.trim().length).toBeGreaterThan(0);
  });
});
