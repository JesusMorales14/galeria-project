# 0002 · El navegador nunca llama a la API del museo: BFF con Route Handlers y Server Components

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

La API del Art Institute permite 60 peticiones por minuto **por IP**, pide la cabecera de cortesía `AIC-User-Agent` y devuelve un formato propio que puede cambiar.

## Opciones consideradas

1. **Llamar a la API desde el navegador:** cada visitante consume su propio límite, no hay caché compartida y los componentes dependen del formato del museo.
2. **Backend propio:** servidor que mantener.
3. **Backend for Frontend dentro de Next.js:** Server Components y Route Handlers (`/api/artworks`) desplegados como funciones de Vercel.

## Decisión

Opción 3. Los Server Components llaman a `@galeria/api-client` a través de `shared/api` con `"use cache"`. El cliente (colecciones) usa `/api/artworks?ids=`, que valida la entrada con Zod y responde con datos ya normalizados y `Cache-Control` para la CDN.

## Consecuencias

- Las respuestas se reutilizan entre visitantes (`cacheLife`): el límite de la API deja de ser un problema práctico.
- Los errores del museo se traducen a respuestas propias (`503` con `Retry-After`, `502`) sin filtrar detalles internos.
- Cambiar de proveedor afecta solo a `api-client` y `shared/api`.
- **Coste:** las funciones de Vercel tienen arranque en frío; se mitiga con la caché.
