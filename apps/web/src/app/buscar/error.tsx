"use client";

import { ErrorState } from "@galeria/ui";

/** Si la API falla, se explica qué pasó y se ofrece reintentar (vuelve a pedir los datos). */
export default function SearchError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <ErrorState
        title="No pudimos cargar las obras"
        description="El museo no respondió a tiempo o hay demasiadas peticiones. Espera unos segundos y vuelve a intentarlo."
        onRetry={retry}
      />
    </main>
  );
}
