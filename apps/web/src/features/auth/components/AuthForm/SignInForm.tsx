"use client";

import { useActionState, useRef } from "react";
import { Field, fieldDescriptionIds } from "@galeria/ui";
import { signInAction } from "../../actions/authActions";
import { INITIAL_AUTH_FORM_STATE } from "../../actions/formState";
import { useFocusFirstError } from "../../hooks/useFocusFirstError";
import { EmailField } from "./EmailField";
import { FormAlert } from "./FormAlert";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";

/**
 * Formulario de acceso. Funciona sin JavaScript (Server Action con el atributo action);
 * con JavaScript, muestra los errores sin recargar y conserva el correo escrito.
 */
export function SignInForm({ next }: { next: string }) {
  const [state, action] = useActionState(signInAction, INITIAL_AUTH_FORM_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, state);
  const errors = state.fieldErrors ?? {};
  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <FormAlert message={state.message} />
      <input type="hidden" name="next" value={next} />
      <EmailField error={errors.email} defaultValue={state.values?.email} />
      <Field label="Contraseña" htmlFor="clave" error={errors.password}>
        <PasswordInput
          id="clave"
          name="password"
          autoComplete="current-password"
          required
          maxLength={128}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={fieldDescriptionIds("clave", { error: errors.password })}
        />
      </Field>
      <div>
        <SubmitButton>Entrar</SubmitButton>
      </div>
    </form>
  );
}
