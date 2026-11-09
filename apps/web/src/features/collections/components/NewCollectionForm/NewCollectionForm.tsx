"use client";

import { useId, useState, type FormEvent } from "react";
import { Button, cn, TextInput } from "@galeria/ui";
import { collectionNameSchema, MAX_NAME_LENGTH } from "../../lib/collection";

type NewCollectionFormProps = {
  onCreate: (name: string) => Promise<unknown>;
  label?: string;
  submitLabel?: string;
  className?: string;
};

/** Crea una colección. El error se asocia al campo y se anuncia. */
export function NewCollectionForm({
  onCreate,
  label = "Nueva colección",
  submitLabel = "Crear",
  className,
}: NewCollectionFormProps) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = collectionNameSchema.safeParse(new FormData(form).get("nombre") ?? "");
    if (!parsed.success) return setError(`Escribe un nombre de 1 a ${MAX_NAME_LENGTH} caracteres.`);
    setError(null);
    setPending(true);
    try {
      await onCreate(parsed.data);
      form.reset();
    } catch {
      setError("No pudimos crear la colección. Inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={`${id}-name`} className="text-label font-medium text-ink">
        {label}
      </label>
      <div className="flex gap-2">
        <TextInput
          id={`${id}-name`}
          name="nombre"
          maxLength={MAX_NAME_LENGTH}
          placeholder="Para mi sala"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Button type="submit" variant="secondary" loading={pending} className="shrink-0">
          {submitLabel}
        </Button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
