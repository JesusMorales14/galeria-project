"use client";

import { useEffect } from "react";
import { ErrorState } from "@galeria/ui";
import { reportError } from "@/shared/observability";

type Props = { error: Error & { digest?: string }; retry: () => void };

/** Error inesperado en cualquier página: mensaje útil, reporte a Sentry y reintento. */
export default function AppError({ error, retry }: Props) {
  useEffect(() => reportError(error, "app"), [error]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <ErrorState
        title="Algo salió mal en esta sala"
        description="Ya nos llegó el aviso. Vuelve a intentarlo; si sigue fallando, prueba en unos minutos."
        onRetry={retry}
      />
    </main>
  );
}
