import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Profiler } from "react";
import { WHEEL_SETTLE_MS } from "./useLiveZoom";
import { ZoomViewer } from "./ZoomViewer";

/*
 * Presupuesto de renders del visor: lo que se mueve a cada fotograma no pasa por React.
 * El <Profiler> cuenta cada vez que React confirma (commit) un render del árbol.
 */

const props = { src: "/a.jpg", width: 1000, height: 800, alt: "Obra de prueba", title: "Obra" };

function pointer(type: string, init: { id: number; x: number; y: number }) {
  const event = new MouseEvent(type, { bubbles: true, clientX: init.x, clientY: init.y });
  Object.assign(event, { pointerId: init.id, pointerType: "mouse" });
  return event;
}

function renderCounted() {
  const commits = { count: 0 };
  render(
    <Profiler id="visor" onRender={() => void commits.count++}>
      <ZoomViewer {...props} />
    </Profiler>,
  );
  const viewer = screen.getByRole("application", { name: "Obra de prueba" });
  const image = viewer.querySelector("img") as HTMLImageElement;
  const send = (event: Event) => act(() => void viewer.dispatchEvent(event));
  return { commits, viewer, image, send, rendersSince: (from: number) => commits.count - from };
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 1000,
    height: 800,
    top: 0,
    left: 0,
    right: 1000,
    bottom: 800,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("ZoomViewer: renders", () => {
  it("un botón = un render", () => {
    const { commits, rendersSince } = renderCounted();
    const before = commits.count;

    fireEvent.click(screen.getByRole("button", { name: "Acercar" }));

    expect(rendersSince(before)).toBe(1);
  });

  it("arrastrar no renderiza mientras dura el gesto; al soltar, un único render", () => {
    const { commits, viewer, image, send, rendersSince } = renderCounted();
    fireEvent.click(screen.getByRole("button", { name: "Acercar" }));
    const before = commits.count;

    send(pointer("pointerdown", { id: 1, x: 500, y: 400 }));
    for (let step = 1; step <= 30; step++) {
      send(pointer("pointermove", { id: 1, x: 500 - step, y: 400 - step }));
    }

    expect(rendersSince(before)).toBe(0); // 30 movimientos, 0 renders
    expect(image.style.transform).toBe("translate(-30px, -30px) scale(1.5)"); // la imagen sí se movió
    expect(viewer.hasAttribute("data-gesturing")).toBe(true);

    send(pointer("pointerup", { id: 1, x: 470, y: 370 }));

    expect(rendersSince(before)).toBe(1);
    expect(viewer.hasAttribute("data-gesturing")).toBe(false);
  });

  it("Ctrl + rueda: sin renders mientras gira; uno cuando se detiene", () => {
    vi.useFakeTimers();
    const { commits, viewer, rendersSince } = renderCounted();
    const before = commits.count;

    for (let turn = 0; turn < 10; turn++) {
      fireEvent.wheel(viewer, { deltaY: -20, ctrlKey: true, clientX: 500, clientY: 400 });
    }
    expect(rendersSince(before)).toBe(0);

    act(() => vi.advanceTimersByTime(WHEEL_SETTLE_MS));

    expect(rendersSince(before)).toBe(1);
    expect(screen.getByRole("status").textContent).not.toBe("Zoom 100 %");
  });
});
