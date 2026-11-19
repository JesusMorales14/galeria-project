import { Field, fieldDescriptionIds, TextInput } from "@galeria/ui";

type EmailFieldProps = { error?: string; defaultValue?: string };

export function EmailField({ error, defaultValue }: EmailFieldProps) {
  return (
    <Field label="Correo" htmlFor="correo" error={error}>
      <TextInput
        id="correo"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        required
        maxLength={254}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={fieldDescriptionIds("correo", { error })}
      />
    </Field>
  );
}
