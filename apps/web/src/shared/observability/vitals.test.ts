import { describe, expect, it, vi } from "vitest";
import { normalizePath, registerVitalsSink, reportVital } from "./vitals";

const metric = { name: "LCP", value: 1800, rating: "good" as const, id: "v1" };

describe("reportVital", () => {
  it("entrega la métrica a cada destino registrado", () => {
    const sink = vi.fn();
    const unregister = registerVitalsSink(sink);

    reportVital(metric, "/obra/[id]");

    expect(sink).toHaveBeenCalledWith(metric, { path: "/obra/[id]" });
    unregister();
  });

  it("un destino que falla no impide que lleguen al resto", () => {
    const ok = vi.fn();
    const unregisterBroken = registerVitalsSink(() => {
      throw new Error("caído");
    });
    const unregisterOk = registerVitalsSink(ok);

    expect(() => reportVital(metric, "/")).not.toThrow();
    expect(ok).toHaveBeenCalledOnce();
    unregisterBroken();
    unregisterOk();
  });
});

describe("normalizePath", () => {
  it("agrupa las páginas de obra en una sola ruta", () => {
    expect(normalizePath("/obra/27992")).toBe("/obra/[id]");
    expect(normalizePath("/buscar")).toBe("/buscar");
  });
});
