import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/** Bloque de carga. Decorativo: el estado de carga se anuncia en otro lugar. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse bg-placeholder motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
