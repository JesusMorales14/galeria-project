import { afterEach, describe, expect, it, vi } from "vitest";
import { playPinAnimation } from "./pinAnimation";

const element = () =>
  ({ animate: vi.fn() }) as unknown as Element & { animate: ReturnType<typeof vi.fn> };

describe("playPinAnimation", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("anima el marcador directamente en el elemento, sin pasar por React", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const icon = element();
    playPinAnimation(icon);
    expect(icon.animate).toHaveBeenCalledOnce();
  });

  it("respeta prefers-reduced-motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const icon = element();
    playPinAnimation(icon);
    expect(icon.animate).not.toHaveBeenCalled();
  });

  it("no falla sin elemento", () => {
    expect(() => playPinAnimation(null)).not.toThrow();
  });
});
