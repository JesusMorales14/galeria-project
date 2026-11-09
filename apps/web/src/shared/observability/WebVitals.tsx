"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { normalizePath, registerVitalsSink, reportVital, type VitalMetric } from "./vitals";

const logInDevelopment = (metric: VitalMetric, { path }: { path: string }) => {
  console.debug(
    `[web-vitals] ${path} ${metric.name}=${Math.round(metric.value)} (${metric.rating ?? "?"})`,
  );
};

/** Mide LCP, CLS, INP, FCP y TTFB de visitantes reales y los reparte a los destinos registrados. */
export function WebVitals() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    return registerVitalsSink(logInDevelopment);
  }, []);

  useReportWebVitals((metric) => reportVital(metric, normalizePath(pathname)));
  return null;
}
