# 0004 · Renderizado híbrido: ISR con Cache Components en las páginas de obra

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

Los datos de una obra casi nunca cambian; la búsqueda depende de la URL. La app usa Next.js 16 con `cacheComponents` y Partial Prefetching activados, donde el antiguo `export const revalidate` se sustituye por `"use cache"` + `cacheLife`.

## Opciones consideradas

| Estrategia           | Para qué sirve                        | Por qué sí o no aquí                                               |
| -------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| Estático (SSG)       | Contenido que no cambia               | Hay miles de obras: no se pueden generar todas en el build         |
| SSR en cada petición | Datos personalizados o muy cambiantes | Gastaría el límite de la API en datos que no cambian               |
| **ISR**              | Mucho contenido que cambia poco       | Destacadas en el build; el resto, la primera vez que alguien entra |

## Decisión

- `/obra/[id]`: `generateStaticParams` con las 7 obras destacadas (estáticas en el build) y `getArtwork` con `cacheLife("days")`. Las demás obras sirven el _app shell_ al instante y se guardan tras la primera visita.
- Portada: obras destacadas cacheadas, prerenderizada.
- `/buscar`: renderizado en el servidor en cada petición, con datos cacheados por horas (ver ADR 0008).

## Consecuencias

- En el build, las destacadas aparecen como `○` (estáticas) y el resto como `◐` (prerender parcial).
- `notFound()` dentro de `Suspense` responde 404 real a los buscadores y 200 con `noindex` a las personas: es como funciona el streaming en Next.
- **Coste:** hay que pensar en qué está dentro y fuera de `Suspense`, y leer la documentación de la versión instalada (`node_modules/next/dist/docs`).
