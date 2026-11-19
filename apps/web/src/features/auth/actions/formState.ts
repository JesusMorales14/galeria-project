import type { AuthErrorCode } from "../lib/authService";
import type { FieldErrors } from "../lib/credentials";

/** Respuesta de una Server Action de formulario: errores y lo que la persona escribió. */
export type AuthFormState = {
  message?: string;
  fieldErrors?: FieldErrors;
  /** Se devuelven para no vaciar el formulario (nunca la contraseña). */
  values?: { name?: string; email?: string };
};

export const INITIAL_AUTH_FORM_STATE: AuthFormState = {};

/** Mensajes en la voz de la interfaz: qué pasó y cómo seguir, sin revelar qué cuentas existen. */
export const AUTH_ERROR_MESSAGES: Partial<Record<AuthErrorCode, AuthFormState>> = {
  invalid_credentials: {
    message: "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo.",
  },
  email_taken: {
    fieldErrors: { email: "Ya hay una cuenta con este correo. Entra con ella o usa otro." },
  },
};

export function tooManyAttempts(retryAfterMs: number): string {
  const minutes = Math.max(1, Math.ceil(retryAfterMs / 60_000));
  const unit = minutes === 1 ? "minuto" : "minutos";
  return `Demasiados intentos seguidos. Vuelve a intentarlo dentro de ${minutes} ${unit}.`;
}
