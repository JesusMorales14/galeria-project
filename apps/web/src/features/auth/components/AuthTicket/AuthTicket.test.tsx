import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../../../test/a11y";
import { formatMemberSince, sessionsLabel } from "../AccountOverview/accountText";
import { AuthTicket } from "./AuthTicket";

describe("AuthTicket", () => {
  it("la sección se nombra con su h1 y el talón decorativo queda fuera del árbol accesible", async () => {
    const { container } = render(
      <AuthTicket titleId="t" title="Entrar" intro={<p>Intro</p>} footer={<p>Pie</p>}>
        <p>Formulario</p>
      </AuthTicket>,
    );

    expect(screen.getByRole("region", { name: "Entrar" })).toBeDefined();
    expect(screen.queryByText("Admisión general")?.closest("[aria-hidden='true']")).not.toBeNull();
    await expectNoA11yViolations(container);
  });
});

describe("textos de la cuenta", () => {
  it("fecha de alta en español, sin depender de la zona horaria", () => {
    expect(formatMemberSince("2026-11-01T00:00:00.000Z")).toBe("noviembre de 2026");
  });

  it("sesiones abiertas en lenguaje natural", () => {
    expect(sessionsLabel(1)).toBe("Solo esta");
    expect(sessionsLabel(3)).toBe("3, contando esta");
  });
});
