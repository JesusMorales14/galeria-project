import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { registerVitalsSink } from "./vitals";
import { WebVitals } from "./WebVitals";

let report: ((metric: { name: string; value: number; id: string }) => void) | undefined;
vi.mock("next/web-vitals", () => ({
  useReportWebVitals: (callback: typeof report) => (report = callback),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/obra/27992" }));

describe("WebVitals", () => {
  it("reparte las métricas reales con la ruta agrupada", () => {
    const sink = vi.fn();
    const unregister = registerVitalsSink(sink);
    render(<WebVitals />);

    report?.({ name: "LCP", value: 1234, id: "v1" });

    expect(sink).toHaveBeenCalledWith(expect.objectContaining({ name: "LCP" }), {
      path: "/obra/[id]",
    });
    unregister();
  });
});
