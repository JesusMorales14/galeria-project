# 0011 · Cuentas en PostgreSQL y despliegue en Railway con Docker

- **Estado:** aceptada (resuelve las deudas técnicas 10 y 12)
- **Fecha:** 2026-11-17

## Contexto

Las cuentas, los tokens de refresco y el límite de intentos vivían en la memoria del proceso ([ADR 0009](0009-autenticacion-con-tokens.md)). En un servidor como Railway eso tenía dos fallos: cada redespliegue o reinicio borraba cuentas y sesiones, y con más de una réplica cada proceso tenía su propia memoria, así que las sesiones fallaban según la réplica que atendiera la petición.

## Decisión

**PostgreSQL** (el plugin de Railway) como almacén compartido, detrás de las mismas interfaces:

| Interfaz                            | Memoria (desarrollo, tests)     | Postgres (producción)             |
| ----------------------------------- | ------------------------------- | --------------------------------- |
| `UserRepository`                    | `createMemoryUserRepository`    | `createPostgresUserRepository`    |
| `RefreshTokenStore`                 | `createMemoryRefreshTokenStore` | `createPostgresRefreshTokenStore` |
| `AttemptStore` (límite de intentos) | `createMemoryAttemptStore`      | `createPostgresAttemptStore`      |

**Corrección con varias réplicas** (antes era «comprobar y luego escribir», con carreras):

- `insert` de cuentas: `INSERT … ON CONFLICT (email) DO NOTHING RETURNING`. El índice único decide; dos registros simultáneos no crean dos cuentas.
- Consumir un token de refresco: _compare-and-set_ `UPDATE … SET used_at = $2 WHERE used_at IS NULL AND NOT revoked RETURNING`. Si dos réplicas reciben el mismo token a la vez, una gana y la otra recibe `refresh_race`.
- El límite de intentos se cuenta en la tabla compartida: vale para todas las réplicas.

**Seleccionar el almacén** (`readStorageConfig`): con `DATABASE_URL`, Postgres; sin ella en desarrollo, memoria; sin ella **en producción, error al arrancar** y `/api/health` responde 503. Perder cuentas en silencio en cada despliegue sería peor que no arrancar. `AUTH_STORAGE=memory` lo permite a propósito (e2e y Lighthouse).

**Migraciones:** SQL versionado en `apps/web/db/migrations/`, aplicado por `db/migrate.mjs` dentro de una transacción por archivo, con registro en `schema_migrations` y un _advisory lock_ para que dos despliegues no migren a la vez. Railway lo ejecuta como `preDeployCommand`: si falla, el despliegue se detiene y sigue la versión anterior.

**Despliegue con Dockerfile** (no con el builder automático): imagen multi-etapa con la salida `standalone` de Next.js, sin código fuente ni dependencias de desarrollo, ejecutada con el usuario `node`. Es reproducible (Node 22 y pnpm 12 fijados) y portable a cualquier plataforma con contenedores.

**Healthcheck real:** `/api/health` hace una consulta a la base de datos. Railway no envía tráfico a un despliegue que no la alcanza.

## Opciones descartadas

- **Redis para sesiones:** rápido, pero las cuentas igualmente necesitan una base de datos durable; dos servicios en lugar de uno.
- **Un ORM (Prisma, Drizzle):** tres tablas y unas pocas consultas no lo justifican; SQL parametrizado es más fácil de revisar y no añade generación de código al build.
- **Fijar 1 réplica y aceptar la memoria:** ocultaba el problema en lugar de resolverlo.

## Consecuencias

- Las cuentas y sesiones sobreviven a reinicios y redespliegues, y la app escala horizontalmente.
- Los repositorios se prueban contra un **Postgres real** (PGlite, Postgres compilado a WebAssembly) con las mismas migraciones de producción, sin Docker en los tests. El mismo contrato de tests se ejecuta contra memoria y Postgres, incluidas la concurrencia y la simulación de dos réplicas.
- Nueva dependencia de ejecución: `pg`. De desarrollo: `@electric-sql/pglite`.
- La caché de Next.js (`use cache`) sigue siendo por instancia: con varias réplicas cada una calienta la suya. Los datos del museo son públicos y cacheables, así que no afecta a la corrección.
