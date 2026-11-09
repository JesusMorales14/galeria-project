import * as Sentry from "@sentry/nextjs";
import type { SearchQuery } from "@galeria/api-client";
import { searchErrorContext } from "./errorContext";

/** Adjunta los filtros activos (sin texto del usuario) a cualquier error de esta petición. */
export function setSearchScope(query: SearchQuery): void {
  Sentry.setContext("busqueda", searchErrorContext(query));
}
