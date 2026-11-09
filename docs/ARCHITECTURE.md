# Arquitectura

Galería se organiza en **capas con dependencias en una sola dirección** y en **componentes pequeños con una sola responsabilidad**. Las reglas importantes no dependen de la memoria de nadie: ESLint las hace cumplir en cada PR.

## Paquetes del monorepo

```text
apps/web ──► packages/ui          (componentes presentacionales)
         └─► packages/api-client  (datos del museo, validados y tipados)
todos    ──► packages/config      (TypeScript, ESLint, Prettier)
```

| Paquete               | Sabe de…                                | No sabe de…                |
| --------------------- | --------------------------------------- | -------------------------- |
| `packages/ui`         | React, estilos, accesibilidad           | De dónde vienen los datos  |
| `packages/api-client` | La API del museo, Zod, tipos de dominio | React, Next.js             |
| `apps/web`            | Rutas, composición, caché, SEO          | El formato crudo de la API |

## Capas dentro de `apps/web/src`

```text
src/
├── app/                 # 1. Rutas de Next.js: solo componen, sin lógica
├── features/            # 2. Funcionalidades del producto (home, search, artwork…)
│   └── <feature>/
│       ├── components/  #    un componente por carpeta
│       ├── hooks/       #    estado y efectos del cliente
│       ├── lib/         #    funciones puras de la feature
│       └── index.ts     #    API pública: lo único importable desde fuera
└── shared/              # 3. Código transversal sin dominio (config, utilidades)
```

**Dirección de las dependencias:** `app → features → shared`. Nunca al revés.

| Regla                                         | Cómo se hace cumplir                                 |
| --------------------------------------------- | ---------------------------------------------------- |
| Una feature se importa solo por su `index.ts` | `no-restricted-imports` (`@/features/*/*` prohibido) |
| `shared/` no depende de `features/`           | `no-restricted-imports` en `src/shared/**`           |
| Nadie importa desde `app/`                    | `no-restricted-imports` (`@/app/**` prohibido)       |
| Dentro de una feature, imports relativos      | Consecuencia de la primera regla                     |

## Tamaño y complejidad

| Regla ESLint             | Límite                 | Si salta…                                                            |
| ------------------------ | ---------------------- | -------------------------------------------------------------------- |
| `max-lines`              | 150 líneas por archivo | Extrae un componente, hook o función a su propio archivo             |
| `max-lines-per-function` | 60 líneas              | Divide el componente en subcomponentes                               |
| `complexity`             | 10                     | Sustituye condicionales encadenados por un mapa o funciones pequeñas |
| `max-depth`              | 3 niveles              | Usa retornos tempranos                                               |
| `max-params`             | 3 parámetros           | Agrupa en un objeto con tipo                                         |

Los tests (`*.test.ts[x]`) están exentos de los límites de longitud.

## Componentes

- **Una carpeta por componente**: `HomeIntro/HomeIntro.tsx`, `HomeIntro.test.tsx`, `index.ts`.
- **Presentación separada de datos**: un componente presentacional recibe todo por props. Quien obtiene los datos es la ruta (`app/`) o un componente contenedor de la feature.
- **Server Components por defecto**. `"use client"` solo en el componente más pequeño que necesite interactividad.
- **Nombres**: componentes en `PascalCase`, hooks `useAlgo`, funciones y archivos de utilidades en `camelCase`.

## Tests

- Junto al código que prueban (`Componente.test.tsx` al lado de `Componente.tsx`).
- Se prueba lo que el usuario ve y hace (Testing Library por rol y texto), no detalles internos.
- TDD: primero el test que falla, luego el código mínimo que lo hace pasar.

## Mapa de `apps/web/src`

```text
app/                      rutas: page, layout, error, not-found, route handlers (api/)
features/
  home/                   portada y obras destacadas
  search/                 filtros en la URL, formulario, resultados, paginación
  artwork/                ficha, visor, metadatos, JSON-LD, relacionadas
  collections/            dominio, repositorio (IndexedDB), casos de uso, store, UI
shared/
  api/                    cliente del museo con caché ("use cache") y utilidades del BFF
  artwork/                cuadrícula, miniatura, texto alternativo, props de imagen
  config/                 identidad del sitio, obras destacadas, URL pública
  layout/                 cabecera, pie, enlace para saltar al contenido
  observability/          Web Vitals y reporte de errores (cliente); ./server para Sentry en servidor
  ui/                     adaptadores de Next.js para el design system (AppLink, fuentes)
```

## Código que solo corre en el servidor

`shared/api/client.ts` y `shared/api/artworks.ts` importan `server-only`: si un componente de cliente los importara, el build fallaría. Lo mismo `shared/observability/server.ts`.

## Decisiones

Cada decisión técnica relevante se documenta en `docs/adr/` con la plantilla `0000-plantilla.md`.
