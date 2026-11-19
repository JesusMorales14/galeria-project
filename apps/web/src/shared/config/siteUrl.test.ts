import { describe, expect, it } from "vitest";
import { siteUrl } from "./siteUrl";

describe("siteUrl", () => {
  it("prioriza la URL configurada explícitamente", () => {
    expect(
      siteUrl({
        NEXT_PUBLIC_SITE_URL: "https://galeria.dev",
        VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app",
      }).href,
    ).toBe("https://galeria.dev/");
  });

  it("usa el dominio público de Railway", () => {
    expect(
      siteUrl({
        RAILWAY_PUBLIC_DOMAIN: "galeria.up.railway.app",
        VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app",
      }).href,
    ).toBe("https://galeria.up.railway.app/");
  });

  it("usa el dominio de producción de Vercel", () => {
    expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "galeria.vercel.app" }).href).toBe(
      "https://galeria.vercel.app/",
    );
  });

  it("cae a localhost en desarrollo", () => {
    expect(siteUrl({}).href).toBe("http://localhost:3000/");
  });
});
