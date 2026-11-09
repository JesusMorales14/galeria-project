/** Métrica de Web Vitals tal como la entrega Next.js (subconjunto que usamos). */
export type VitalMetric = {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
  id: string;
  navigationType?: string;
};

export type VitalsSink = (metric: VitalMetric, context: { path: string }) => void;

const sinks = new Set<VitalsSink>();

/** Registra un destino para las métricas (consola en desarrollo, Sentry en producción). */
export function registerVitalsSink(sink: VitalsSink): () => void {
  sinks.add(sink);
  return () => sinks.delete(sink);
}

/** Reparte cada métrica a todos los destinos. Un destino que falla no afecta a los demás. */
export function reportVital(metric: VitalMetric, path: string): void {
  for (const sink of sinks) {
    try {
      sink(metric, { path });
    } catch {
      // La observabilidad nunca debe romper la página.
    }
  }
}

/** Ruta sin parámetros de consulta: agrupa métricas y evita guardar datos del usuario. */
export function normalizePath(pathname: string): string {
  return pathname.replace(/\/\d+(?=\/|$)/g, "/[id]");
}
