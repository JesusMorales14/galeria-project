/**
 * Solo las funciones de Sentry que usa el navegador. Importarlas por nombre permite
 * al bundler descartar el resto del SDK (Replay, Feedback…) del chunk diferido.
 */
export {
  addBreadcrumb,
  browserTracingIntegration,
  captureException,
  captureRouterTransitionStart,
  init,
} from "@sentry/nextjs";
