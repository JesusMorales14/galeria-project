import * as Sentry from "@sentry/nextjs";
import { scrubEvent, sentryOptions } from "@/shared/observability/server";

Sentry.init({ ...sentryOptions(), beforeSend: scrubEvent });
