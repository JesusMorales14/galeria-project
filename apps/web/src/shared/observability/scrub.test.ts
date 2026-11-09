import { describe, expect, it } from "vitest";
import { scrubEvent, scrubUrl } from "./scrub";
import { sentryOptions } from "./sentryOptions";

describe("scrubUrl", () => {
  it("filtra el texto libre y conserva los filtros útiles para depurar", () => {
    expect(scrubUrl("https://galeria.dev/buscar?q=mi+nombre&tipo=Painting&pagina=2")).toBe(
      "https://galeria.dev/buscar?q=%5Bfiltrado%5D&tipo=Painting&pagina=2",
    );
    expect(scrubUrl("/coleccion?nombre=Regalo+para+Ana&obras=1,2")).toBe(
      "/coleccion?nombre=%5Bfiltrado%5D&obras=1%2C2",
    );
  });
});

describe("scrubEvent", () => {
  it("quita cookies y cabeceras y limpia URLs de la petición y del rastro", () => {
    const event = scrubEvent({
      request: {
        url: "https://galeria.dev/buscar?artista=Ana",
        cookies: { a: 1 },
        headers: { x: 1 },
        query_string: "artista=Ana",
      },
      breadcrumbs: [{ data: { from: "/buscar?q=secreto", to: "/obra/1" } }],
    });
    expect(event.request).toEqual({ url: "https://galeria.dev/buscar?artista=%5Bfiltrado%5D" });
    expect(event.breadcrumbs?.[0]?.data).toEqual({
      from: "/buscar?q=%5Bfiltrado%5D",
      to: "/obra/1",
    });
  });
});

describe("sentryOptions", () => {
  it("lee el DSN con una referencia literal (la que Next.js inyecta en el navegador)", async () => {
    const { vi } = await import("vitest");
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://x@o.ingest.sentry.io/1");
    expect(sentryOptions().enabled).toBe(true);
    vi.unstubAllEnvs();
  });

  it("sin DSN, Sentry queda desactivado", () => {
    expect(sentryOptions({})).toMatchObject({ enabled: false, sendDefaultPii: false });
  });

  it("muestrea menos trazas en producción que en las vistas previas", () => {
    expect(
      sentryOptions({
        NEXT_PUBLIC_SENTRY_DSN: "https://x@o.ingest.sentry.io/1",
        VERCEL_ENV: "production",
      }),
    ).toMatchObject({
      enabled: true,
      environment: "production",
      tracesSampleRate: 0.2,
    });
    expect(
      sentryOptions({
        NEXT_PUBLIC_SENTRY_DSN: "https://x@o.ingest.sentry.io/1",
        VERCEL_ENV: "preview",
      }).tracesSampleRate,
    ).toBe(1);
  });
});
