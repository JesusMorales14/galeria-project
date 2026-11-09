import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Slot } from "./Slot";

describe("Slot", () => {
  it("fusiona clases y props en el hijo sin añadir elementos", () => {
    render(
      <Slot className="base" data-from-slot="si">
        <a href="/x" className="hijo">
          Enlace
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "Enlace" });
    expect(link.className).toBe("base hijo");
    expect(link.getAttribute("data-from-slot")).toBe("si");
  });

  it("no renderiza nada si el hijo no es un elemento", () => {
    // @ts-expect-error se prueba un uso incorrecto
    const { container } = render(<Slot>texto</Slot>);
    expect(container.textContent).toBe("");
  });
});
