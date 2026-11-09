import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../../test/a11y";
import { ZoomViewer } from "./ZoomViewer";

const props = {
  src: "/obra-843.jpg",
  srcSet: "/obra-843.jpg 843w, /obra-1686.jpg 1686w",
  width: 3000,
  height: 2000,
  alt: "Personas descansando junto al río",
  title: "A Sunday on La Grande Jatte",
};

const viewer = () => screen.getByRole("application", { name: props.alt });
const image = () => viewer().querySelector("img") as HTMLImageElement;
const status = () => screen.getByRole("status");

describe("ZoomViewer", () => {
  it("es un visor nombrado, enfocable y con instrucciones asociadas", () => {
    render(<ZoomViewer {...props} />);
    expect(
      screen.getByRole("region", { name: "Visor de zoom: A Sunday on La Grande Jatte" }),
    ).toBeDefined();
    expect(viewer().getAttribute("tabindex")).toBe("0");
    const help = document.getElementById(viewer().getAttribute("aria-describedby") ?? "");
    expect(help?.textContent).toContain("las flechas mueven la vista");
  });

  it("acerca, aleja y restablece con los botones, y lo anuncia", async () => {
    render(<ZoomViewer {...props} />);
    expect(status().textContent).toBe("Zoom 100 %");

    await userEvent.click(screen.getByRole("button", { name: "Acercar" }));
    expect(status().textContent).toBe("Zoom 150 %");
    expect(image().style.transform).toContain("scale(1.5)");

    await userEvent.click(screen.getByRole("button", { name: "Alejar" }));
    expect(status().textContent).toBe("Zoom 100 %");

    await userEvent.click(screen.getByRole("button", { name: "Acercar" }));
    await userEvent.click(screen.getByRole("button", { name: "Restablecer" }));
    expect(status().textContent).toBe("Zoom 100 %");
  });

  it("se maneja entero con el teclado: +, -, 0 y flechas", async () => {
    render(<ZoomViewer {...props} />);
    viewer().focus();

    await userEvent.keyboard("++");
    expect(status().textContent).toBe("Zoom 225 %");
    await userEvent.keyboard("-");
    expect(status().textContent).toBe("Zoom 150 %");
    await userEvent.keyboard("0");
    expect(status().textContent).toBe("Zoom 100 %");
  });

  it("con zoom, las flechas mueven la vista sin salirse de la imagen", async () => {
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
    render(<ZoomViewer {...props} />);
    viewer().focus();

    await userEvent.keyboard("++{ArrowRight}");
    expect(image().style.transform).toMatch(/^translate\(-100px(, 0px)?\) scale\(2\.25\)$/);
    await userEvent.keyboard("{ArrowUp}");
    expect(image().style.transform).toBe("translate(-100px, 80px) scale(2.25)");
    vi.restoreAllMocks();
  });

  it("deshabilita alejar y restablecer cuando no hay zoom", () => {
    render(<ZoomViewer {...props} />);
    expect(screen.getByRole("button", { name: "Alejar" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: "Restablecer" }).hasAttribute("disabled")).toBe(true);
  });

  it("pide una imagen más grande al acercar (srcset + sizes según el zoom)", async () => {
    render(<ZoomViewer {...props} />);
    expect(image().getAttribute("sizes")).toContain("58vw");
    await userEvent.click(screen.getByRole("button", { name: "Acercar" }));
    expect(image().getAttribute("sizes")).toContain("87vw");
  });

  it("sin zoom permite el scroll vertical de la página en móvil", () => {
    render(<ZoomViewer {...props} />);
    expect(viewer().className).toContain("touch-pan-y");
  });

  it("no tiene problemas de accesibilidad", async () => {
    const { container } = render(<ZoomViewer {...props} />);
    await expectNoA11yViolations(container);
  });
});
