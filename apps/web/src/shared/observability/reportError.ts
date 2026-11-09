/**
 * Reporta un error capturado por un error boundary, con la sección donde ocurrió.
 * El SDK se importa bajo demanda: no pesa en las páginas que no fallan.
 */
export function reportError(error: Error & { digest?: string }, boundary: string): void {
  void import("./sentryClient").then((Sentry) =>
    Sentry.captureException(error, { tags: { boundary, digest: error.digest ?? "cliente" } }),
  );
}
