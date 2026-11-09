import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../../test/a11y";
import { Button } from "./Button";

describe("Button", () => {
  it("ejecuta la acción al pulsarlo con ratón o teclado", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("es type=button por defecto para no enviar formularios sin querer", () => {
    render(<Button>Acción</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("en estado de carga se deshabilita y lo anuncia", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Guardar
      </Button>,
    );
    const button = screen.getByRole("button", { name: /guardar/i });

    await userEvent.click(button);

    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("no tiene problemas de accesibilidad", async () => {
    const { container } = render(<Button variant="secondary">Cancelar</Button>);
    await expectNoA11yViolations(container);
  });
});
