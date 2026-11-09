import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Registra los tamaños de texto propios para que no choquen con los colores (text-ink).
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["display", "title", "label"] } },
});

/** Une clases condicionales y resuelve conflictos de Tailwind (la última gana). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
