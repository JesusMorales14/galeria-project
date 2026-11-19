import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../../../../test/a11y";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

const actions = vi.hoisted(() => ({
  signInAction: vi.fn(),
  signUpAction: vi.fn(),
}));

// Las Server Actions se sustituyen: aquí se prueba la interfaz, no el servidor.
vi.mock("../../actions/authActions", () => actions);

describe("SignInForm", () => {
  beforeEach(() => {
    actions.signInAction.mockReset();
  });

  it("tiene etiquetas visibles, autocompletado correcto y es accesible", async () => {
    const { container } = render(<SignInForm next="/cuenta" />);

    expect(screen.getByLabelText("Correo").getAttribute("autocomplete")).toBe("email");
    expect(screen.getByLabelText("Contraseña").getAttribute("autocomplete")).toBe(
      "current-password",
    );
    await expectNoA11yViolations(container);
  });

  it("envía el destino y muestra los errores junto a cada campo, con el foco en el primero", async () => {
    actions.signInAction.mockResolvedValue({
      fieldErrors: { email: "Escribe un correo válido." },
      values: { email: "mal" },
    });
    render(<SignInForm next="/obra/1" />);

    await userEvent.type(screen.getByLabelText("Correo"), "mal");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    const email = await screen.findByRole("textbox", { name: "Correo" });
    await waitFor(() => expect(document.activeElement).toBe(email));
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(email.getAttribute("aria-describedby")).toBe("correo-error");
    expect(screen.getByText("Escribe un correo válido.")).toBeDefined();

    const sent = actions.signInAction.mock.calls[0]![1] as FormData;
    expect(sent.get("next")).toBe("/obra/1");
  });

  it("anuncia los errores generales con role=alert", async () => {
    actions.signInAction.mockResolvedValue({ message: "El correo o la contraseña no coinciden." });
    render(<SignInForm next="/cuenta" />);

    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect((await screen.findByRole("alert")).textContent).toContain("no coinciden");
  });

  it("el botón de la contraseña la muestra y lo indica con aria-pressed", async () => {
    render(<SignInForm next="/cuenta" />);
    const toggle = screen.getByRole("button", { name: "Mostrar contraseña" });
    const password = screen.getByLabelText("Contraseña");

    expect(password.getAttribute("type")).toBe("password");
    await userEvent.click(toggle);
    expect(password.getAttribute("type")).toBe("text");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
  });
});

describe("SignUpForm", () => {
  it("explica la regla de la contraseña antes de enviar y es accesible", async () => {
    const { container } = render(<SignUpForm next="/cuenta" />);

    const password = screen.getByLabelText("Contraseña");
    expect(password.getAttribute("autocomplete")).toBe("new-password");
    expect(password.getAttribute("aria-describedby")).toBe("clave-hint");
    expect(screen.getByText(/Al menos 10 caracteres/)).toBeDefined();
    await expectNoA11yViolations(container);
  });

  it("conserva lo escrito cuando el servidor devuelve un error", async () => {
    actions.signUpAction.mockResolvedValue({
      fieldErrors: { email: "Ya hay una cuenta con este correo." },
      values: { name: "Ana", email: "ana@example.com" },
    });
    render(<SignUpForm next="/cuenta" />);

    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(await screen.findByText("Ya hay una cuenta con este correo.")).toBeDefined();
    expect((screen.getByLabelText("Nombre") as HTMLInputElement).value).toBe("Ana");
  });
});
