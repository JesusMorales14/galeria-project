# 0008 · Búsqueda con renderizado bloqueante para que funcione sin JavaScript

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

La búsqueda debe funcionar con el teclado y **sin JavaScript** (mejora progresiva). La primera versión de `/buscar` usaba streaming: `loading.tsx` y `<Suspense>` alrededor del formulario y de los resultados.

Un test e2e con JavaScript desactivado demostró que no funcionaba: con streaming, React envía el contenido tardío en un bloque oculto y lo revela con un `<script>`. Sin JavaScript, el usuario se quedaba viendo para siempre el esqueleto de `loading.tsx`, sin formulario.

## Opciones consideradas

1. **Streaming (prerender parcial):** primer pintado instantáneo, pero roto sin JavaScript.
2. **Renderizado bloqueante:** el servidor espera los datos y envía el HTML completo.

## Decisión

Renderizado bloqueante en `/buscar`: sin `loading.tsx` ni `Suspense` alrededor de los datos, y con `export const instant = false` para declarar que la navegación puede esperar.

## Consecuencias

- La búsqueda funciona sin JavaScript, y un e2e lo comprueba.
- Las respuestas de la API están cacheadas (`cacheLife("hours")`), así que la espera es corta; los errores siguen yendo a `error.tsx`.
- **Coste:** las navegaciones dentro de la app esperan a los datos en lugar de mostrar un esqueleto. Las páginas de obra y la portada mantienen el prerender con streaming, porque allí no se exige funcionar sin JavaScript.
