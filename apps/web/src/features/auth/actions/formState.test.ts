import { describe, expect, it } from "vitest";
import { AUTH_ERROR_MESSAGES, tooManyAttempts } from "./formState";

describe("mensajes de los formularios de acceso", () => {
  it("dice cuánto esperar tras demasiados intentos, redondeando hacia arriba", () => {
    expect(tooManyAttempts(30_000)).toContain("1 minuto.");
    expect(tooManyAttempts(14 * 60_000 + 1)).toContain("15 minutos.");
  });

  it("un fallo de acceso no revela si el correo tiene cuenta", () => {
    expect(AUTH_ERROR_MESSAGES.invalid_credentials?.message).toBe(
      "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo.",
    );
  });
});
