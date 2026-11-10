import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { GET } from "./route";

const IMAGE = "https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg";
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const call = (path: string[]) =>
  GET(new Request("http://localhost/api/iiif"), { params: Promise.resolve({ path }) });

describe("GET /api/iiif", () => {
  it("sirve la imagen del museo desde nuestro dominio, con caché larga", async () => {
    let userAgent: string | null = null;
    server.use(
      http.get(IMAGE, ({ request }) => {
        userAgent = request.headers.get("AIC-User-Agent");
        return new HttpResponse(new Uint8Array([0xff, 0xd8]), {
          headers: { "Content-Type": "image/jpeg" },
        });
      }),
    );

    const response = await call(["abc-123", "full", "843,", "0", "default.jpg"]);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=2592000");
    expect(userAgent).toContain("galeria");
  });

  it("rechaza rutas que no son imágenes permitidas, sin llamar al museo", async () => {
    expect((await call(["..", "secret"])).status).toBe(400);
    expect((await call(["abc", "full", "9999,", "0", "default.jpg"])).status).toBe(400);
  });

  it("no acepta una página de desafío como imagen y reintenta una vez", async () => {
    let calls = 0;
    server.use(
      http.get(IMAGE, () => {
        calls += 1;
        return calls === 1
          ? new HttpResponse("<html>Attention Required</html>", {
              headers: { "Content-Type": "text/html" },
            })
          : new HttpResponse(new Uint8Array([0xff, 0xd8]), {
              headers: { "Content-Type": "image/jpeg" },
            });
      }),
    );

    const response = await call(["abc-123", "full", "843,", "0", "default.jpg"]);

    expect(calls).toBe(2);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
  });

  it("propaga el 404 y convierte el resto de fallos en 502 sin cachearlos", async () => {
    server.use(http.get(IMAGE, () => new HttpResponse(null, { status: 404 })));
    expect((await call(["abc-123", "full", "843,", "0", "default.jpg"])).status).toBe(404);

    server.use(http.get(IMAGE, () => new HttpResponse("Attention Required", { status: 403 })));
    const blocked = await call(["abc-123", "full", "843,", "0", "default.jpg"]);
    expect(blocked.status).toBe(502);
    expect(blocked.headers.get("Cache-Control")).toBe("no-store");
  });
});
