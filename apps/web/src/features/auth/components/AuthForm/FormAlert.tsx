import { CircleAlert } from "lucide-react";

/**
 * Error general del formulario. role="alert" lo anuncia al aparecer, sin mover el foco.
 * Los errores de cada campo van junto a su campo (Field).
 */
export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-3 border-l-4 border-danger bg-danger/8 px-4 py-3 font-sans text-[1.0625rem] font-medium text-ink"
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-danger" />
      {message}
    </p>
  );
}
