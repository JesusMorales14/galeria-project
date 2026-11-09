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

  it("lleva a las dos tareas principales: buscar y colecciones", () => {
    render(<HomeIntro title="Galería" description="x" />);

    expect(screen.getByRole("link", { name: "Buscar en la colección" }).getAttribute("href")).toBe(
      "/buscar",
    );
    expect(screen.getByRole("link", { name: "Ver mis colecciones" }).getAttribute("href")).toBe(
      "/colecciones",
    );
  });
});
