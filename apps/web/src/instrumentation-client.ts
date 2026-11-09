import type * as SentryClient from "@/shared/observability/sentryClient";
import { registerVitalsSink } from "@/shared/observability";
import { scrubEvent } from "@/shared/observability/scrub";
import { sentryOptions } from "@/shared/observability/sentryOptions";

/**
 * Sentry en el navegador se carga cuando el navegador queda libre: no compite con el LCP
 * ni suma ~100 KB al JavaScript inicial (lo vigila Lighthouse CI).
 * Las Web Vitals se siguen midiendo porque los PerformanceObserver usan `buffered: true`.
 */
type SentryModule = typeof SentryClient;
let sentry: SentryModule | null = null;

async function loadSentry() {
  const options = sentryOptions();
  if (!options.enabled) return;
  const Sentry = await import("@/shared/observability/sentryClient");
  Sentry.init({
    ...options,
    integrations: [Sentry.browserTracingIntegration()],
    beforeSend: scrubEvent,
  });
  sentry = Sentry;
}

if (typeof window !== "undefined") {
  const idle =
    window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1));
  idle(() => void loadSentry());

  // Las métricas también quedan como rastro (breadcrumb) del error que ocurra después.
  registerVitalsSink((metric, { path }) => {
    sentry?.addBreadcrumb({
      category: "web-vital",
      level: metric.rating === "poor" ? "warning" : "info",
      message: `${metric.name} ${Math.round(metric.value)} en ${path}`,
    });
  });
}

export function onRouterTransitionStart(
  ...args: Parameters<SentryModule["captureRouterTransitionStart"]>
) {
  sentry?.captureRouterTransitionStart(...args);
}
