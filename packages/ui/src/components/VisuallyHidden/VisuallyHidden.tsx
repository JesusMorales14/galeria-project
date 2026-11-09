import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/** Texto solo para lectores de pantalla. */
export function VisuallyHidden({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("sr-only", className)} {...props} />;
}
