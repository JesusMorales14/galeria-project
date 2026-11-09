import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveRegion } from "./LiveRegion";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("oculta el texto a la vista pero no al lector de pantalla", () => {
    render(<VisuallyHidden>Solo para lectores</VisuallyHidden>);
    const node = screen.getByText("Solo para lectores");
    expect(node.className).toContain("sr-only");
  });
});

describe("LiveRegion", () => {
  it("anuncia cambios de forma educada por defecto", () => {
    render(<LiveRegion>24 obras encontradas</LiveRegion>);
    const region = screen.getByRole("status");
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(region.textContent).toBe("24 obras encontradas");
  });
});
