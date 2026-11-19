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
  auth/                   cuentas: servicio, repositorios, Server Actions, DAL, formularios
shared/
  api/                    cliente del museo con caché ("use cache") y utilidades del BFF
  auth/                   tokens JWT, cookies, decideAccess y redirecciones seguras (sin dominio)
  security/               cabeceras de seguridad y CSP (las usa next.config.ts)
  artwork/                cuadrícula, miniatura, texto alternativo, props de imagen
  config/                 identidad del sitio, obras destacadas, URL pública
  layout/                 cabecera, pie, enlace para saltar al contenido
  observability/          Web Vitals y reporte de errores (cliente); ./server para Sentry en servidor
  ui/                     adaptadores de Next.js para el design system (AppLink, fuentes)
```

## Patrones de diseño aplicados

| Patrón                               | Dónde                                                                          | Para qué                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Repositorio                          | `CollectionsRepository`, `UserRepository`, `RefreshTokenStore`, `AttemptStore` | La persistencia se cambia sin tocar casos de uso ni UI (memoria ↔ Postgres) |
| Adaptador de base de datos           | `SqlClient` (`pg` en producción, PGlite en tests)                              | Los repositorios Postgres se prueban contra Postgres real sin Docker        |
| Tests de contrato                    | `storageContract.test.ts`                                                      | Las mismas pruebas para cada implementación de almacenamiento               |
| Servicio + inyección de dependencias | `createCollectionsService`, `createAuthService`                                | Casos de uso puros, probados con dobles rápidos (reloj, ids, hash)          |
| Raíz de composición                  | `features/auth/server/container.ts`                                            | Único sitio que elige implementaciones concretas                            |
| Capa de acceso a datos (DAL)         | `features/auth/server/session.ts`                                              | Toda lectura protegida verifica la sesión en el servidor                    |
| Adaptador                            | `useCollections` (`useSyncExternalStore`), `AppLink`                           | Conecta el dominio con React o con el router                                |
| Slot / inversión de dependencias     | `SiteHeader account={…}`                                                       | `shared/` muestra la sesión sin conocer la feature `auth`                   |
| Función pura de decisión             | `decideAccess`, `zoomState`, `spotlight`                                       | La lógica se prueba sin navegador ni Next.js                                |

## Presupuesto de renders

Regla: **cero renders innecesarios**. React solo renderiza cuando cambia algo que la persona debe ver, y nunca por eventos continuos (puntero, rueda, scroll).

| Caso                                          | Renders                           | Cómo                                                                                                                           |
| --------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Páginas, cuadrículas, fichas                  | 0 en el cliente                   | Server Components: llegan como HTML                                                                                            |
| Foco que sigue al puntero                     | 0 por movimiento                  | `useSpotlight` escribe variables CSS en `requestAnimationFrame`                                                                |
| Arrastre, pellizco y Ctrl + rueda en el visor | 0 durante el gesto, 1 al terminar | `useLiveZoom`: vista previa en el `style` de la imagen; confirmación al soltar (o 150 ms después de la última vuelta de rueda) |
| Botones y teclado del visor                   | 1 por acción                      | Cambia el nivel anunciado y el estado de los botones                                                                           |
| Animaciones (sala, salón, entrada, marcador)  | 0                                 | CSS, `animation-timeline` y Web Animations API                                                                                 |
| Colecciones                                   | Solo si cambia la instantánea     | `useSyncExternalStore`                                                                                                         |
| Hijos que no cambian                          | 0                                 | React Compiler (`reactCompiler: true`): memoización automática, sin `useMemo`/`useCallback` a mano                             |

Los tests lo comprueban con el `<Profiler>` de React (`ZoomViewer/renders.test.tsx`, `useSpotlight.test.tsx`): si un cambio vuelve a renderizar durante un gesto, el CI falla.

## `proxy.ts`

Se ejecuta antes de renderizar `/cuenta`, `/entrar` y `/registro`. Solo comprueba la firma del token de acceso (sin estado) y delega la decisión en `decideAccess` (`shared/auth`). No sustituye a la verificación en el servidor: es un filtro optimista ([ADR 0009](adr/0009-autenticacion-con-tokens.md)).

## Base de datos

`apps/web/db/migrations/*.sql` son la única fuente del esquema; `db/migrate.mjs` las aplica en orden (una transacción por archivo, _advisory lock_, tabla `schema_migrations`). Lo usan el despliegue (`pnpm --filter @galeria/web db:migrate`) y los tests. Detalle en [ADR 0011](adr/0011-persistencia-y-despliegue-en-railway.md).

## Código que solo corre en el servidor

`shared/api/client.ts` y `shared/api/artworks.ts` importan `server-only`: si un componente de cliente los importara, el build fallaría. Lo mismo `shared/observability/server.ts` y `features/auth/server/*` (contenedor, sesión, refresco).

## Decisiones

Cada decisión técnica relevante se documenta en `docs/adr/` con la plantilla `0000-plantilla.md`.
