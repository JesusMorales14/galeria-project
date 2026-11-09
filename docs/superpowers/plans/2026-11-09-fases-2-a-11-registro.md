# Registro de ejecución · Fases 2 a 11

> Las fases 2 a 11 se ejecutaron seguidas en una sola sesión, a petición expresa ("elabora todos los pasos del proyecto ahora"). No hubo un plan aprobado por fase: este documento registra **qué se hizo, qué se decidió y cómo se verificó** en cada una. Cada fase tiene su rama y su merge `--no-ff` en `main`.

## Verificación común a todas las fases

- `pnpm verify` (formato, lint, tipos y tests con umbral de cobertura) antes de cada merge.
- Build contra la API simulada (`apps/web/e2e/mock-aic`): desde el entorno de desarrollo no había acceso a `api.artic.edu`.
- Revisión en navegador real con Playwright: capturas en claro, oscuro y móvil, y axe en cada página.

## Fase 2 · Contrato con la API

- `@galeria/api-client`: esquemas Zod, normalización a `Artwork`/`ArtworkSummary`, errores tipados, `buildImageUrl`.
- BFF: `/api/artworks?ids=` y `/api/artworks/[id]` con `"use cache"` y validación de entrada.
- **Depuración:** MSW no interceptaba porque el cliente guardaba `fetch` al crearse → se resuelve en cada llamada.
- **Depuración:** un `beforeEach` que devolvía `mockClear()` se ejecutaba como limpieza → llaves en el callback.

## Fase 3 · Design system

- Dirección "sala de museo" (`DESIGN.md`), tokens en Tailwind v4, 8 componentes y Storybook con addon de accesibilidad.
- 22 historias sin violaciones de axe en claro y oscuro.

## Fase 4 · Búsqueda

- Filtros en la URL validados con Zod, formulario GET con `next/form`, paginación accesible, resumen con `aria-live`.
- Tests de integración (buscar, filtrar, vacío, error) con MSW.

## Fase 5 · Obra

- `generateStaticParams` para las destacadas, `cacheLife("days")`, metadatos de Open Graph, JSON-LD, `sitemap.xml` y `robots.txt`.
- 404: real para buscadores; 200 con `noindex` para personas (streaming).

## Fase 6 · Rendimiento

- Medición antes/después con Lighthouse: −75 % a −97 % en bytes de imagen.
- **Investigación:** el LCP de la portada es bimodal por el umbral de carga diferida de Chrome _headless_; documentado en lugar de "maquillado".

## Fase 7 · Visor de zoom

- Reducer puro + hooks + vista; teclado, botones, Ctrl + rueda, arrastre y pellizco. ADR 0006.

## Fase 8 · Colecciones

- Dominio, repositorio (IndexedDB y memoria), casos de uso y store. ADR 0007.
- **Depuración:** reordenar perdía el foco y el anuncio → la petición usa el conjunto de ids, no el orden.

## Fase 9 · E2E

- 4 flujos × 2 dispositivos con axe; cobertura ≥ 80 %.
- **Hallazgo:** con streaming, la búsqueda no funcionaba sin JavaScript → renderizado bloqueante (ADR 0008).
- **Bug real:** el store reutilizaba un `BroadcastChannel` cerrado → test de regresión.

## Fase 10 · Observabilidad

- Sentry en servidor y cliente, `scrubEvent`, contexto de búsqueda sin texto del usuario, incidente 001.
- **Lighthouse CI detectó** +107 KB por el SDK → carga diferida tras `load`.
- **Bug evitado:** el DSN no habría llegado al navegador (Next solo inyecta lecturas literales de `process.env`).
- Zod fuera del bundle del navegador: −27 KB.

## Fase 11 · Documentación

- README, ADRs 0001–0008, `TECH_DEBT.md`, `CONTRIBUTING.md`, plantilla de PR y workflows de CI.
- Revisión final (critique/audit/polish): 8 vistas sin violaciones de axe en claro, oscuro y móvil.

## Pendiente fuera del repositorio

- Añadir `.github/` (workflows y plantilla de PR): ruta protegida para el agente.
- Desplegar en Vercel y Storybook, configurar Sentry y completar el incidente 001 con el evento real.
- Capturar fixtures reales (`fixtures:capture`) y medir el rendimiento sobre el despliegue.
- Reescribir los ADRs con palabras propias antes de una entrevista.
