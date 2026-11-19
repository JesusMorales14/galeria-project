"use client";

import { useActionState, useRef } from "react";
import { Field, fieldDescriptionIds, TextInput } from "@galeria/ui";
import { signUpAction } from "../../actions/authActions";
import { INITIAL_AUTH_FORM_STATE } from "../../actions/formState";
import { useFocusFirstError } from "../../hooks/useFocusFirstError";
import { PASSWORD_MIN_LENGTH } from "../../lib/credentials";
import { EmailField } from "./EmailField";
import { FormAlert } from "./FormAlert";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";

const PASSWORD_HINT = `Al menos ${PASSWORD_MIN_LENGTH} caracteres. Una frase corta es más fácil de recordar.`;

export function SignUpForm({ next }: { next: string }) {
  const [state, action] = useActionState(signUpAction, INITIAL_AUTH_FORM_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);
  const errors = state.fieldErrors ?? {};
  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <FormAlert message={state.message} />
      <input type="hidden" name="next" value={next} />
      <Field label="Nombre" htmlFor="nombre" error={errors.name}>
        <TextInput
          id="nombre"
          name="name"
          autoComplete="name"
          required
          maxLength={60}
          defaultValue={state.values?.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={fieldDescriptionIds("nombre", { error: errors.name })}
        />
      </Field>
      <EmailField error={errors.email} defaultValue={state.values?.email} />
      <Field label="Contraseña" htmlFor="clave" hint={PASSWORD_HINT} error={errors.password}>
        <PasswordInput
          id="clave"
          name="password"
          autoComplete="new-password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={128}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={fieldDescriptionIds("clave", {
            hint: PASSWORD_HINT,
            error: errors.password,
          })}
        />
      </Field>
      <div>
        <SubmitButton>Crear cuenta</SubmitButton>
      </div>
    </form>
  );
}
