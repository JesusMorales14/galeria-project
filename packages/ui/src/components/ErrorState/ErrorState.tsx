import { cn } from "../../lib/cn";
import { Button } from "../Button";

export type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

/** Error recuperable: dice qué pasó y cómo seguir. Se anuncia de inmediato. */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Reintentar",
  className,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={cn("flex max-w-prose flex-col items-start gap-3 py-16", className)}
    >
      <h2 className="font-display text-title text-ink">{title}</h2>
      {description && <p className="text-ink-muted">{description}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-3">
          {retryLabel}
        </Button>
      )}
    </section>
  );
}
