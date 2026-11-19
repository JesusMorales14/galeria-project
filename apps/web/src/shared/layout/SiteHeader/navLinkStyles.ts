import { cn } from "@galeria/ui";

/**
 * Enlace de navegación: una barra ultramar crece desde la izquierda al pasar el ratón
 * y se queda en la página actual.
 */
export function navLinkStyles(active: boolean): string {
  return cn(
    "relative inline-flex min-h-11 items-center font-sans text-[1.125rem] font-semibold text-ink-muted transition-colors hover:text-ink",
    "after:absolute after:inset-x-0 after:bottom-1.5 after:h-[3px] after:origin-left after:scale-x-0 after:bg-accent",
    "after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100",
    active && "text-ink after:scale-x-100",
  );
}
