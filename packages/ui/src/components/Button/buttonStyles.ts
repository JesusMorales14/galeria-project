import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-sans font-medium " +
  "transition-colors duration-200 ease-out-expo select-none " +
  "disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-wall hover:bg-accent hover:text-accent-ink",
  secondary: "border border-ink/80 text-ink hover:border-accent hover:text-accent",
  ghost: "text-ink hover:bg-ink/6",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
};

/** Clases del botón, exportadas para aplicarlas también a enlaces con forma de botón. */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}
