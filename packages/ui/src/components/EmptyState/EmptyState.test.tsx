import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("explica la situación y ofrece una salida", () => {
    render(
      <EmptyState
        title="No encontramos obras"
        description="Prueba quitando algún filtro."
        action={<a href="/buscar">Limpiar filtros</a>}
      />,
    );

    expect(screen.getByRole("heading", { name: "No encontramos obras" })).toBeDefined();
    expect(screen.getByText("Prueba quitando algún filtro.")).toBeDefined();
    expect(screen.getByRole("link", { name: "Limpiar filtros" })).toBeDefined();
  });

  it("permite elegir el nivel del encabezado", () => {
    render(<EmptyState title="Vacío" headingLevel={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Vacío" })).toBeDefined();
  });
});
