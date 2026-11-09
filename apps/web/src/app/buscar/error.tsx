"use client";

import { useEffect } from "react";
import { ErrorState } from "@galeria/ui";
import { reportError } from "@/shared/observability";

type Props = { error: Error & { digest?: string }; retry: () => void };

/** Si la API falla, se explica qué pasó, se reporta a Sentry y se ofrece reintentar. */
export default function SearchError({ error, retry }: Props) {
  useEffect(() => reportError(error, "buscar"), [error]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <ErrorState
        title="No pudimos cargar las obras"
        description="El museo no respondió o devolvió datos que no esperábamos. Espera unos segundos y vuelve a intentarlo."
        onRetry={retry}
      />
    </main>
  );
}
