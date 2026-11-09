import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../test/a11y";
import { Field } from "./Field";
import { Select } from "./Select";
import { TextInput } from "./TextInput";

describe("Field", () => {
  it("asocia la etiqueta visible con el campo", () => {
    render(
      <Field label="Artista" htmlFor="artista">
        <TextInput id="artista" name="artista" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Artista" })).toBeDefined();
  });

  it("asocia la ayuda al campo con aria-describedby", () => {
    render(
      <Field label="Buscar" htmlFor="q" hint="Título, artista o tema">
        <TextInput id="q" name="q" aria-describedby="q-hint" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Buscar" }).getAttribute("aria-describedby")).toBe(
      "q-hint",
    );
    expect(screen.getByText("Título, artista o tema").id).toBe("q-hint");
  });

  it("el select muestra sus opciones y es accesible", async () => {
    const { container } = render(
      <Field label="Tipo de obra" htmlFor="tipo">
        <Select id="tipo" name="tipo" defaultValue="">
          <option value="">Todos</option>
          <option value="Painting">Pintura</option>
        </Select>
      </Field>,
    );
    expect(screen.getByRole("combobox", { name: "Tipo de obra" })).toBeDefined();
    await expectNoA11yViolations(container);
  });
});
