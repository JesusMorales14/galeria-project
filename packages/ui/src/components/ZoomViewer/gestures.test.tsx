import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ZoomViewer } from "./ZoomViewer";

const props = { src: "/a.jpg", width: 1000, height: 800, alt: "Obra de prueba", title: "Obra" };
const rect = {
  width: 1000,
  height: 800,
  top: 0,
  left: 0,
  right: 1000,
  bottom: 800,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};

/** Dispara un evento de puntero (jsdom no implementa PointerEvent) dentro de act(). */
function pointer(type: string, init: { id: number; x: number; y: number; touch?: boolean }) {
  const event = new MouseEvent(type, { bubbles: true, clientX: init.x, clientY: init.y });
  Object.assign(event, { pointerId: init.id, pointerType: init.touch ? "touch" : "mouse" });
  return event;
}

const send = (element: Element, event: Event) => act(() => void element.dispatchEvent(event));

const viewer = () => screen.getByRole("application", { name: "Obra de prueba" });
const transform = () => (viewer().querySelector("img") as HTMLImageElement).style.transform;

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect);
});
afterEach(() => vi.restoreAllMocks());

describe("ZoomViewer: rueda y gestos", () => {
  it("la rueda sola no hace zoom (no secuestra el scroll)", () => {
    render(<ZoomViewer {...props} />);
    fireEvent.wheel(viewer(), { deltaY: -100 });
    expect(screen.getByRole("status").textContent).toBe("Zoom 100 %");
  });

  it("Ctrl + rueda acerca hacia el cursor", () => {
    render(<ZoomViewer {...props} />);
    fireEvent.wheel(viewer(), { deltaY: -100, ctrlKey: true, clientX: 500, clientY: 400 });
    expect(screen.getByRole("status").textContent).not.toBe("Zoom 100 %");
  });

  it("con zoom, arrastrar con el ratón mueve la imagen", async () => {
    render(<ZoomViewer {...props} />);
    await userEvent.click(screen.getByRole("button", { name: "Acercar" }));
    const element = viewer();

    send(element, pointer("pointerdown", { id: 1, x: 500, y: 400 }));
    send(element, pointer("pointermove", { id: 1, x: 450, y: 380 }));
    send(element, pointer("pointerup", { id: 1, x: 450, y: 380 }));

    expect(transform()).toMatch(/translate\(-50px, -20px\) scale\(1\.5\)/);
  });

  it("sin zoom, arrastrar con el ratón no hace nada", () => {
    render(<ZoomViewer {...props} />);
    send(viewer(), pointer("pointerdown", { id: 1, x: 500, y: 400 }));
    send(viewer(), pointer("pointermove", { id: 1, x: 400, y: 400 }));
    expect(transform()).toMatch(/scale\(1\)/);
  });

  it("pellizcar con dos dedos acerca", () => {
    render(<ZoomViewer {...props} />);
    const element = viewer();
    send(element, pointer("pointerdown", { id: 1, x: 400, y: 400, touch: true }));
    send(element, pointer("pointerdown", { id: 2, x: 600, y: 400, touch: true }));
    send(element, pointer("pointermove", { id: 1, x: 300, y: 400, touch: true }));
    send(element, pointer("pointermove", { id: 2, x: 700, y: 400, touch: true }));
    send(element, pointer("pointercancel", { id: 1, x: 300, y: 400, touch: true }));

    expect(screen.getByRole("status").textContent).not.toBe("Zoom 100 %");
  });
});
