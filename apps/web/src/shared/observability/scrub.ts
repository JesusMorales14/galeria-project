/** Parámetros de URL que pueden contener lo que escribió el usuario: no salen del navegador. */
const FREE_TEXT_PARAMS = ["q", "artista", "nombre"];

/** Sustituye el texto libre de una URL por "[filtrado]" y conserva los filtros (tipo, época, página…). */
export function scrubUrl(url: string): string {
  try {
    const parsed = new URL(url, "http://local");
    for (const key of FREE_TEXT_PARAMS) {
      if (parsed.searchParams.has(key)) parsed.searchParams.set(key, "[filtrado]");
    }
    const path = `${parsed.pathname}${parsed.search}`;
    return url.startsWith("http") ? `${parsed.origin}${path}` : path;
  } catch {
    return "[url no válida]";
  }
}

type ScrubbableEvent = {
  request?: { url?: string; cookies?: unknown; headers?: unknown; query_string?: unknown };
  breadcrumbs?: Array<{ data?: { url?: string; to?: string; from?: string } }>;
};

/** beforeSend: limpia URLs, cookies y cabeceras antes de enviar un evento a Sentry. */
export function scrubEvent<T extends ScrubbableEvent>(event: T): T {
  if (event.request) {
    if (event.request.url) event.request.url = scrubUrl(event.request.url);
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.query_string;
  }
  for (const crumb of event.breadcrumbs ?? []) {
    for (const key of ["url", "to", "from"] as const) {
      const value = crumb.data?.[key];
      if (value && crumb.data) crumb.data[key] = scrubUrl(value);
    }
  }
  return event;
}
