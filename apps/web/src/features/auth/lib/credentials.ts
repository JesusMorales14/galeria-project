import { z } from "zod";

const email = z
  .string({ error: "Escribe tu correo." })
  .trim()
  .toLowerCase()
  .min(1, "Escribe tu correo.")
  .max(254, "El correo es demasiado largo.")
  .pipe(z.email("Escribe un correo válido, como nombre@dominio.com."));

export const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_MAX_LENGTH = 128; // scrypt con entradas enormes sería un vector de denegación de servicio

export const signInSchema = z.object({
  email,
  password: z
    .string({ error: "Escribe tu contraseña." })
    .min(1, "Escribe tu contraseña.")
    .max(PASSWORD_MAX_LENGTH, "La contraseña es demasiado larga."),
});

export const signUpSchema = z.object({
  name: z
    .string({ error: "Escribe tu nombre." })
    .trim()
    .min(2, "Escribe un nombre de al menos 2 letras.")
    .max(60, "Usa un nombre de 60 caracteres como máximo."),
  email,
  password: z
    .string({ error: "Crea una contraseña." })
    .min(PASSWORD_MIN_LENGTH, `Usa al menos ${PASSWORD_MIN_LENGTH} caracteres.`)
    .max(PASSWORD_MAX_LENGTH, "La contraseña es demasiado larga."),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type FieldErrors = Partial<Record<"name" | "email" | "password", string>>;

/** Primer error de cada campo, listo para mostrar junto a él. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof FieldErrors;
    errors[field] ??= issue.message;
  }
  return errors;
}

/** Lee los campos de texto de un formulario (los File se ignoran). */
export function formFields(formData: FormData, names: readonly string[]) {
  return Object.fromEntries(
    names.map((name) => {
      const value = formData.get(name);
      return [name, typeof value === "string" ? value : undefined];
    }),
  );
}
