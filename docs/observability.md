# Observabilidad

## Qué se mide

| Señal                | Cómo                                                                                                 | Dónde se ve          |
| -------------------- | ---------------------------------------------------------------------------------------------------- | -------------------- |
| Errores del servidor | `onRequestError` en `src/instrumentation.ts` (Server Components, Route Handlers)                     | Sentry → Issues      |
| Errores del cliente  | Error boundaries (`app/error.tsx`, `app/buscar/error.tsx`, `app/global-error.tsx`) con `reportError` | Sentry → Issues      |
| Trazas               | `fetch` instrumentado en el servidor (llamadas a la API del museo); carga y navegación en el cliente | Sentry → Performance |
| Web Vitals reales    | `browserTracingIntegration` (LCP, CLS, INP) + `useReportWebVitals` como rastro                       | Sentry → Web Vitals  |
| Contexto             | Filtros activos de la búsqueda (`setSearchScope`), sección del error (`boundary`), `digest`          | En cada evento       |

## Privacidad

- `sendDefaultPii: false`: ni IPs, ni cookies, ni cabeceras.
- `scrubEvent` sustituye el texto libre de las URL (`q`, `artista`, `nombre`) por `[filtrado]` y conserva los filtros útiles para depurar.
- El contexto de búsqueda dice _si_ había texto, nunca _qué_ texto.

## Coste en rendimiento

El SDK del navegador (~128 KB comprimidos) se importa cuando el navegador queda libre (`requestIdleCallback`), después del evento `load`: **0 KB en la carga inicial**. Las Web Vitals no se pierden, porque los `PerformanceObserver` usan `buffered: true`. Lighthouse CI se ejecuta sin DSN y vigila el JavaScript de la propia app.

**Contrapartida:** un error que ocurra antes de que cargue el SDK (el primer segundo) no se reporta.

## Source maps

`withSentryConfig` (en `next.config.ts`) sube los source maps en el build si existe `SENTRY_AUTH_TOKEN` y los borra después (`deleteSourcemapsAfterUpload`), para que no se publiquen junto a la app.

## Configuración

Variables en `apps/web/.env.example`. Sin `NEXT_PUBLIC_SENTRY_DSN` el SDK no se activa: en desarrollo, en los tests y en los forks no se envía nada.

## Incidentes

- [001 · La búsqueda falla porque la API cambió su respuesta](incidentes/001-cambio-de-contrato-en-busqueda.md)
