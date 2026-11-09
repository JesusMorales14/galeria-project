import { cn } from "@galeria/ui";

export function navLinkStyles(active: boolean): string {
  return cn(
    "py-2 text-[0.9375rem] text-ink-muted transition-colors hover:text-ink",
    "decoration-accent decoration-2 underline-offset-8",
    active && "text-ink underline",
  );
}
