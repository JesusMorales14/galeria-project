# Plan · Pulido de diseño con frontend-design y ui-ux-pro-max

> Brief fijado por Jesús (2026-11-09): mantener la dirección «sala de museo». A evitar: plantilla SaaS, tienda de láminas, banco de imágenes.

## 1. Sistema (se mantiene)

| Token       | Valor                 | Papel                                   |
| ----------- | --------------------- | --------------------------------------- |
| `wall`      | `#f4f1ea` / `#141311` | Pared de la sala (claro / oscuro)       |
| `ink`       | `#1c1b18` / `#ede8df` | Texto y botón primario                  |
| `ink-muted` | `#5e5a52` / `#a39c90` | Cartelas                                |
| `accent`    | `#7b2d26` / `#d99a8c` | Burdeos: foco, selección, estado activo |
| `line`      | `#d9d3c7` / `#34312c` | Separadores de 1px                      |

Tipografía: Newsreader (títulos; cursiva para títulos de obra) + Instrument Sans (lectura y controles). Alineación a la izquierda en todo el sitio.

## 2. Revisión contra el brief y contra los rasgos genéricos que señala frontend-design

| Rasgo genérico                                               | Situación                                                       | Decisión                                                                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Fondo crema + serif de alto contraste                        | Coincide                                                        | **Se mantiene:** es el brief. La identidad se apoya en la cartela de museo y en la obra, no en el fondo. |
| Metadatos unidos con punto medio (`A · B · C`)               | Resumen de búsqueda, lista de colecciones, colección compartida | **Se elimina:** frases con comas y puntos, como una cartela real («Georges Seurat, 1884–86»).            |
| La portada abre con un titular, no con lo más característico | La portada empieza con «Galería» en grande                      | **Se cambia:** la portada abre con una obra colgada a gran tamaño.                                       |
| Antetítulos, mayúsculas sostenidas, flechas `→`              | No hay                                                          | —                                                                                                        |
| Tarjetas con sombra, gradientes                              | No hay                                                          | —                                                                                                        |

## 3. Portada: la obra primero

Un único momento audaz: una obra destacada colgada a gran tamaño, con su cartela. Todo lo demás queda en silencio.

```text
Escritorio                                         Móvil
┌───────────────────────────────────────────────┐  ┌──────────────────┐
│ Galería                   Buscar  Colecciones │  │ Galería   Buscar │
├───────────────────────────────────────────────┤  ├──────────────────┤
│ ┌───────────────────────────┐                 │  │ ┌──────────────┐ │
│ │                           │  Galería  (h1)  │  │ │  OBRA (16:9) │ │
│ │   OBRA EN SALA  (7/12)    │  intro ≤ 60ch   │  │ └──────────────┘ │
│ │   imagen prioritaria      │  [Buscar en la  │  │ Título, cursiva  │
│ │                           │   colección]    │  │ Artista, fecha   │
│ └───────────────────────────┘  Ver colecciones│  │ Galería (h1)     │
│ Título de la obra (cursiva)                    │  │ intro            │
│ Artista, fecha                                 │  │ [Buscar]         │
├───────────────────────────────────────────────┤  ├──────────────────┤
│ Obras destacadas: las otras 6, en cuadrícula  │  │ Obras destacadas │
└───────────────────────────────────────────────┘  └──────────────────┘
```

## 4. Requisitos de ui-ux-pro-max (checklist previo a la entrega)

| Regla                                | Hoy                                                                 | Cambio                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Áreas táctiles ≥ 44 px en móvil      | Botones `sm` 36 px; navegación y paginación ~40 px; casillas ~28 px | 44 px con puntero táctil (`pointer-coarse:`); paginación, navegación y casillas, siempre |
| Cursor de mano en lo clicable        | Tailwind v4 lo quitó de `button`                                    | Regla base para `button`, `summary` y `label[for]`                                       |
| Estado al pulsar sin mover el layout | Sin estado                                                          | `active:` con opacidad, sin desplazar                                                    |
| Iconos SVG de una sola familia       | lucide-react                                                        | —                                                                                        |
| Contraste ≥ 4,5:1 en claro y oscuro  | Cumple                                                              | Se revisa con axe en ambos modos                                                         |
| Responsive 375 / 768 / 1024 / 1440   | Revisado a 390 y 1280                                               | Se revisa en los cuatro anchos                                                           |
| Movimiento reducido                  | Cumple                                                              | —                                                                                        |

**Recomendación que no se adopta:** `next/image`. Las imágenes IIIF ya llegan al ancho exacto (`srcset` de 200/400/843 px) desde el proxy `/api/iiif`; el optimizador de Next las procesaría dos veces y añadiría coste en Vercel. Las otras dos reglas del stack (`loading.tsx` y prioridad solo en la imagen LCP) ya se cumplen, salvo `/buscar` (ADR 0008).

**Propuesta automática descartada:** el `--design-system` de ui-ux-pro-max propuso estilo suizo con grises zinc y Space Grotesk. Contradice el brief, y ambas skills indican que el brief manda.
