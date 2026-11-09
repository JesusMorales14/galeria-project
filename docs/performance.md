# Rendimiento: imágenes

## El problema

Galería muestra decenas de imágenes de alta resolución por página. Una implementación directa (`<img src>` a 1686 px, sin `srcset`, sin medidas y sin carga diferida) descarga casi **6 MB de imágenes en cualquier página**: Next.js precarga en segundo plano las rutas enlazadas (como la portada), y sin `loading="lazy"` el navegador descarga también sus imágenes aunque no se vean.

## Qué se cambió

| Técnica                                                            | Dónde                                 | Efecto                                                                                                |
| ------------------------------------------------------------------ | ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| IIIF al ancho exacto + `srcset`/`sizes` (200, 400, 843 px)         | `shared/artwork/imageProps.ts`        | El navegador baja el tamaño que necesita la pantalla; 843 px es el ancho que el museo tiene en caché. |
| Proporción reservada (`aspect-ratio` desde ancho y alto de la API) | `ArtworkImage`                        | CLS = 0: nada salta al cargar.                                                                        |
| `loading="lazy"` salvo la imagen principal                         | `ArtworkImage`                        | Solo se descarga lo que está cerca de la pantalla.                                                    |
| `fetchpriority="high"` + carga inmediata en la imagen LCP          | portada, búsqueda (2 primeras) y obra | La imagen principal compite menos.                                                                    |
| `preconnect` al servidor IIIF                                      | `preconnectToImages`                  | DNS + TLS adelantados (sobre todo en móvil).                                                          |
| Placeholder `lqip` del museo difuminado, sin JavaScript            | `ArtworkImage`                        | Se percibe la obra antes de que llegue.                                                               |
| Fuentes locales con `next/font`                                    | `shared/ui/fonts.ts`                  | Sin peticiones a Google; fallback con métricas ajustadas.                                             |

## Antes y después

Lighthouse móvil (simulación por defecto: red 4G lenta y CPU 4×), mediana de 5 ejecuciones, contra la API simulada con imágenes JPEG de peso real (`pnpm --filter @galeria/web perf:measure`).

**Antes** (implementación directa):

| Ruta              | Puntuación | LCP    | CLS   | TBT    | JavaScript | Imágenes |
| ----------------- | ---------- | ------ | ----- | ------ | ---------- | -------- |
| `/`               | 84         | 4.35 s | 0.000 | 106 ms | 155 KB     | 5949 KB  |
| `/buscar?q=monet` | 99         | 0.96 s | 0.000 | 118 ms | 155 KB     | 5949 KB  |
| `/obra/27992`     | 93         | 3.13 s | 0.000 | 103 ms | 155 KB     | 5949 KB  |

**Después:**

| Ruta              | Puntuación | LCP    | CLS   | TBT    | JavaScript | Imágenes |
| ----------------- | ---------- | ------ | ----- | ------ | ---------- | -------- |
| `/`               | 87         | 3.83 s | 0.000 | 113 ms | 155 KB     | 1498 KB  |
| `/buscar?q=monet` | 100        | 0.94 s | 0.000 | 80 ms  | 155 KB     | 764 KB   |
| `/obra/27992`     | 90         | 3.46 s | 0.000 | 90 ms  | 155 KB     | 172 KB   |

### Lectura honesta de los números

- **Bytes de imagen: −75 % en la portada, −87 % en búsqueda y −97 % en la página de obra.** Es la mejora principal y la que más nota alguien con datos móviles.
- **LCP:** en esta simulación queda dentro del ruido (±0,5 s). Chrome _headless_ usa un umbral de carga diferida de ~3000 px (un móvil real con 4G usa 1250 px), así que la simulación sigue repartiendo el ancho de banda entre más imágenes de las que bajaría un móvil real. El LCP de la portada además es bimodal (3,2 s o 5,7 s según la ejecución).
- **CLS:** 0 en ambas en el viewport móvil de Lighthouse, porque los saltos de la versión directa ocurren fuera de la pantalla. La proporción reservada garantiza 0 también en escritorio, y está cubierta por tests.
- **JavaScript:** 155 KB en todas las rutas; el presupuesto de CI es 200 KB.

> Las cifras definitivas se toman sobre el despliegue de Vercel con la API real: `pnpm --filter @galeria/web perf:measure https://<tu-app>.vercel.app / /buscar?q=monet /obra/27992`.

## Cómo se vigila

- **Lighthouse CI** (`apps/web/lighthouserc.cjs`) en cada PR, con presupuestos que hacen fallar el build: CLS ≤ 0,02, TBT ≤ 300 ms, JavaScript ≤ 200 KB, LCP ≤ 4 s en búsqueda y obra (6,5 s en portada, por el artefacto anterior), accesibilidad ≥ 95 y SEO ≥ 90.
- **Bundle:** `pnpm --filter @galeria/web analyze` abre el analizador de Turbopack (`next analyze`). `@next/bundle-analyzer` solo funciona con webpack.
- **Web Vitals reales** de los visitantes con `useReportWebVitals` (`shared/observability`), enviados a Sentry (Fase 10).
