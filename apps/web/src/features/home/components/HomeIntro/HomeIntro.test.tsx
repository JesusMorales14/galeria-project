import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeIntro } from "./HomeIntro";

describe("HomeIntro", () => {
  it("muestra la descripción recibida", () => {
    render(<HomeIntro description="Explora la colección." />);

    expect(screen.getByText("Explora la colección.")).toBeDefined();
  });

  it("lleva a las dos tareas principales: buscar y colecciones", () => {
    render(<HomeIntro description="x" />);

    expect(screen.getByRole("link", { name: "Buscar en la colección" }).getAttribute("href")).toBe(
      "/buscar",
    );
    expect(screen.getByRole("link", { name: "Ver mis colecciones" }).getAttribute("href")).toBe(
      "/colecciones",
    );
  });
});
