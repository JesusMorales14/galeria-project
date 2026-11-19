import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../test/a11y";
import { Field, fieldDescriptionIds } from "./Field";
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

  it("muestra el error y lo enlaza con el campo junto a la ayuda", async () => {
    const describedBy = fieldDescriptionIds("correo", { hint: "Tu correo", error: "Falta la @" });
    const { container } = render(
      <Field label="Correo" htmlFor="correo" hint="Tu correo" error="Falta la @">
        <TextInput id="correo" aria-invalid aria-describedby={describedBy} />
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Correo" });
    expect(input.getAttribute("aria-describedby")).toBe("correo-hint correo-error");
    expect(screen.getByText("Falta la @").id).toBe("correo-error");
    await expectNoA11yViolations(container);
  });

  it("sin ayuda ni error no añade aria-describedby", () => {
    expect(fieldDescriptionIds("x", {})).toBeUndefined();
  });
});
