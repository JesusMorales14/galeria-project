import * as Sentry from "@sentry/nextjs";
import { scrubEvent, sentryOptions } from "@/shared/observability/server";

// Servidor (Node): errores y trazas de las llamadas a la API del museo (fetch instrumentado).
Sentry.init({ ...sentryOptions(), beforeSend: scrubEvent });
