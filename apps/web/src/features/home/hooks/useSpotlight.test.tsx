import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Profiler, useRef } from "react";
import { useSpotlight } from "./useSpotlight";

function Room() {
  const ref = useRef<HTMLDivElement>(null);
  useSpotlight(ref);
  return (
    <div ref={ref} data-testid="sala">
      <span data-spot-local="" data-testid="rotulo" />
    </div>
  );
}

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches, media: query }));
}

describe("useSpotlight", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    } as DOMRect);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("mueve el foco hacia el puntero escribiendo variables CSS", () => {
    mockMatchMedia(true);
    const { getByTestId } = render(<Room />);
    const sala = getByTestId("sala");

    fireEvent.pointerMove(sala, { clientX: 200, clientY: 100 });

    expect(sala.style.getPropertyValue("--spot-x")).toMatch(/%$/);
    expect(parseFloat(sala.style.getPropertyValue("--spot-x"))).toBeGreaterThan(34);
    // Los elementos marcados reciben la posición en sus propias coordenadas.
    expect(getByTestId("rotulo").style.getPropertyValue("--lx")).toMatch(/px$/);
  });

  it("si se pide menos movimiento o no hay puntero fino, el foco se queda en reposo", () => {
    mockMatchMedia(false);
    const { getByTestId } = render(<Room />);
    const sala = getByTestId("sala");

    fireEvent.pointerMove(sala, { clientX: 200, clientY: 100 });

    expect(sala.style.getPropertyValue("--spot-x")).toBe("34.00%");
  });

  it("seguir al puntero no provoca ningún render de React", () => {
    mockMatchMedia(true);
    let commits = 0;
    const { getByTestId } = render(
      <Profiler id="sala" onRender={() => void commits++}>
        <Room />
      </Profiler>,
    );
    const afterMount = commits;

    for (let step = 0; step < 50; step++) {
      fireEvent.pointerMove(getByTestId("sala"), { clientX: step * 4, clientY: step * 2 });
    }

    expect(commits).toBe(afterMount);
  });
});
