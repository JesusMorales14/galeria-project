import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type EmptyStateProps = {
  title: string;
  description?: string;
  /** Una salida concreta: limpiar filtros, ir a buscar… */
  action?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section className={cn("flex max-w-prose flex-col items-start gap-3 py-16", className)}>
      <Heading className="font-display text-title text-ink">{title}</Heading>
      {description && <p className="text-ink-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </section>
  );
}
