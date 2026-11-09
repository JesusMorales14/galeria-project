"use client";

import { useEffect } from "react";
import { reportError } from "@/shared/observability";
import "./globals.css";

/** Último recurso: falla el propio layout. Sustituye a <html>, así que no usa el layout del sitio. */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => reportError(error, "global"), [error]);

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-start justify-center gap-4 bg-wall px-6 text-ink">
        <h1 className="font-display text-title">Galería no pudo cargarse</h1>
        <p className="text-ink-muted">
          Ya nos llegó el aviso. Vuelve a intentarlo en unos segundos.
        </p>
        <button type="button" onClick={retry} className="border border-ink px-5 py-2.5">
          Reintentar
        </button>
      </body>
    </html>
  );
}
