import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type FieldProps = {
  label: string;
  htmlFor: string;
  /** Texto de ayuda; su id es `${htmlFor}-hint` para usarlo en aria-describedby. */
  hint?: string;
  children: ReactNode;
  className?: string;
};

/** Etiqueta visible + control + ayuda opcional. La etiqueta nunca es solo un placeholder. */
export function Field({ label, htmlFor, hint, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-label font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${htmlFor}-hint`} className="text-label text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
