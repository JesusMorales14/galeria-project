import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeIntro } from "./HomeIntro";

describe("HomeIntro", () => {
  it("muestra el título recibido como encabezado principal", () => {
    render(<HomeIntro title="Galería" description="Explora la colección." />);

    expect(screen.getByRole("heading", { level: 1, name: "Galería" })).toBeDefined();
  });

  it("muestra la descripción recibida", () => {
    render(<HomeIntro title="Galería" description="Explora la colección." />);

    expect(screen.getByText("Explora la colección.")).toBeDefined();
  });
});
