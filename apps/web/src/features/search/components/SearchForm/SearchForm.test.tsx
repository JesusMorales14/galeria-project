import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchForm } from "./SearchForm";

describe("SearchForm", () => {
  it("es un formulario de búsqueda GET con etiquetas visibles", () => {
    render(<SearchForm filters={{ page: 1 }} />);
    const form = screen.getByRole("search", { name: "Buscar obras" });
    expect(form.getAttribute("action")).toBe("/buscar");
    for (const name of ["Tipo de obra", "Época", "Orden"])
      expect(screen.getByRole("combobox", { name })).toBeDefined();
    expect(screen.getByRole("textbox", { name: "Artista" })).toBeDefined();
  });

  it("muestra los filtros que ya están en la URL", () => {
    render(
      <SearchForm
        filters={{ q: "monet", type: "Print", period: "1800-1899", sort: "oldest", page: 2 }}
      />,
    );
    expect(screen.getByRole("searchbox", { name: "Buscar" })).toHaveProperty("value", "monet");
    expect(screen.getByRole("combobox", { name: "Tipo de obra" })).toHaveProperty("value", "Print");
    expect(screen.getByRole("combobox", { name: "Época" })).toHaveProperty("value", "1800-1899");
    expect(screen.getByRole("combobox", { name: "Orden" })).toHaveProperty("value", "oldest");
  });
});
