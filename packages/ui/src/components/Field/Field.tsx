import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type FieldProps = {
  label: string;
  htmlFor: string;
  /** Texto de ayuda; su id es `${htmlFor}-hint` para usarlo en aria-describedby. */
  hint?: string;
  /** Error de validación; su id es `${htmlFor}-error`. El control debe marcar aria-invalid. */
  error?: string;
  children: ReactNode;
  className?: string;
};

/** Ids que el control debe enlazar con aria-describedby, según lo que muestre el campo. */
export function fieldDescriptionIds(
  htmlFor: string,
  { hint, error }: Pick<FieldProps, "hint" | "error">,
) {
  const ids = [hint && `${htmlFor}-hint`, error && `${htmlFor}-error`].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

/** Etiqueta visible + control + ayuda y error opcionales. La etiqueta nunca es solo un placeholder. */
export function Field({ label, htmlFor, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="font-sans text-label font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${htmlFor}-hint`} className="font-sans text-label text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="font-sans text-label font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
