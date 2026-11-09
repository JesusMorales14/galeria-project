import { describe, expect, it } from "vitest";
import { AicApiError, AicContractError, AicRateLimitError } from "@galeria/api-client";
import { errorToResponse, jsonResponse } from "./responses";

describe("jsonResponse", () => {
  it("añade caché compartida para la CDN", () => {
    const response = jsonResponse({ ok: true });
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=");
  });
});

describe("errorToResponse", () => {
  it("traduce el límite de la API a 503 con Retry-After", async () => {
    const response = errorToResponse(new AicRateLimitError(20));
    expect(response.status).toBe(503);
    expect(response.headers.get("Retry-After")).toBe("20");
    expect(await response.json()).toEqual({ error: "rate_limited" });
  });

  it("traduce errores de la API y de contrato a 502", () => {
    expect(errorToResponse(new AicApiError("x", 500)).status).toBe(502);
    expect(errorToResponse(new AicContractError("x", [])).status).toBe(502);
  });

  it("no filtra detalles internos en errores desconocidos", async () => {
    const response = errorToResponse(new Error("secreto"));
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("secreto");
  });
});
