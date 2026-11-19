---
name: Galería
description: Sala de museo en penumbra para la colección del Art Institute of Chicago.
colors:
  wall: "#dfe3de"
  surface: "#eef1ec"
  ink: "#1b2129"
  ink-muted: "#4b5560"
  line: "#bfc6c0"
  edge: "#727c85"
  accent: "#2b3bb8"
  accent-ink: "#f4f6f2"
  light: "#f3cf7a"
  night: "#141a20"
  night-ink: "#e8ebe5"
  night-ink-muted: "#9ba5ad"
  danger: "#9b1c1c"
  placeholder: "#cfd5cf"
  wall-dark: "#141a20"
  surface-dark: "#1b232b"
  ink-dark: "#e8ebe5"
  ink-muted-dark: "#9ba5ad"
  line-dark: "#2d3740"
  edge-dark: "#6a757e"
  accent-dark: "#9aa6ff"
typography:
  banner:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(4.5rem, 32.5vw - 0.75rem, 26rem)"
    fontWeight: 900
    lineHeight: 0.8
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 1.9rem + 4.6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 1.5rem + 2vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 0.98
  artwork-title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.125rem"
    fontStyle: italic
    lineHeight: 1.375
  body:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1rem"
    lineHeight: 1.6
  label:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "0.9375rem"
    lineHeight: 1.3
rounded:
  control: "2px"
motion:
  ease-out-expo: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-hang: "cubic-bezier(0.34, 1.4, 0.64, 1)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
    hover: "{colors.accent}"
    height: "44px"
  button-inverse:
    backgroundColor: "{colors.night-ink}"
    textColor: "{colors.night}"
    hover: "{colors.light}"
    height: "44px"
  button-secondary:
    borderColor: "{colors.edge}"
    textColor: "{colors.ink}"
    height: "44px"
---

# Design System: Galería

## Overview

**La sala se ilumina.** Un museo no es una pared beis: es una sala pintada de un color frío, en penumbra, donde cada obra recibe su foco. La interfaz se comporta así: la portada es una sala oscura con la obra bajo una luz que sigue al puntero, y el nombre del sitio cuelga como un estandarte de fachada. La colección es la de **Chicago**, y la tipografía de rótulos es la de la ciudad.

Decisión y alternativas en [ADR 0010](docs/adr/0010-identidad-y-movimiento.md). Plan y revisión contra los patrones genéricos en [`docs/superpowers/plans/2026-11-17-sala-iluminada.md`](docs/superpowers/plans/2026-11-17-sala-iluminada.md).

## Colors

| Token       | Claro     | Oscuro    | Papel                                                                             |
| ----------- | --------- | --------- | --------------------------------------------------------------------------------- |
| `wall`      | `#dfe3de` | `#141a20` | Pared: gris de Payne, un pigmento de pintor                                       |
| `surface`   | `#eef1ec` | `#1b232b` | Formularios, visor, la entrada                                                    |
| `ink`       | `#1b2129` | `#e8ebe5` | Texto (12,5:1) y botón primario                                                   |
| `ink-muted` | `#4b5560` | `#9ba5ad` | Cartelas y metadatos (5,9:1)                                                      |
| `line`      | `#bfc6c0` | `#2d3740` | Separadores decorativos                                                           |
| `edge`      | `#727c85` | `#6a757e` | Bordes de controles (≥ 3:1, WCAG 1.4.11)                                          |
| `accent`    | `#2b3bb8` | `#9aa6ff` | **Ultramar**: foco, enlace, estado activo, talón de la entrada                    |
| `light`     | `#f3cf7a` | `#f3cf7a` | **Amarillo de Nápoles**: solo como luz, nunca como superficie ni texto de lectura |
| `night`     | `#141a20` | `#0f1418` | La sala oscura de la portada y el pie: igual en los dos modos, es un lugar        |

### Named Rules

- **Una nota de color, una de luz.** El ultramar marca la interacción; la luz cálida marca dónde se mira. Ninguna decora.
- **La obra no se tiñe.** El foco cae alrededor y encima; nunca se aplica un filtro de color a la imagen en reposo.

## Typography

**Big Shoulders** (variable, con eje óptico): rótulos, títulos de página, navegación, botones y cartelas. Es la tipografía cívica de la ciudad de Chicago; su eje óptico la estrecha en los rótulos grandes y la abre en tamaños de texto. **Newsreader**: lectura y, en cursiva, títulos de obra, como en una cartela de museo. Ambas servidas desde el propio sitio con `next/font/local`.

- `banner` solo para el estandarte de la portada.
- `display` para títulos de página; `title` para secciones.
- `artwork-title` siempre en cursiva.
- Sin mayúsculas sostenidas ni antetítulos.

## Layout

- **Portada:** sala a sangre en `night`. Escritorio: obra (7) · presentación (4) · estandarte vertical. Móvil: obra, presentación y el rótulo en horizontal cruzando la sala.
- **Destacadas:** colgado de salón con columnas (1/2/3), cada obra con su proporción; el orden de lectura sigue las columnas.
- **Búsqueda y colecciones:** cuadrícula por filas (el orden importa), alineada arriba.
- **Acceso:** una entrada de museo centrada, con talón ultramar y línea perforada.
- Márgenes laterales de 16px en móvil y 32px desde `sm`.

## Motion

| Momento                   | Qué pasa                                                                       |
| ------------------------- | ------------------------------------------------------------------------------ |
| Carga de la portada       | El foco se abre, la obra pasa de penumbra a luz y el rótulo sube letra a letra |
| Puntero en la portada     | El foco sigue al puntero con inercia e ilumina el estandarte                   |
| Pasar sobre una obra      | Le cae luz cálida desde arriba                                                 |
| Scroll por las destacadas | Cada cuadro se asienta en su clavo                                             |
| Miniatura → ficha         | La imagen viaja (View Transitions)                                             |
| Guardar en colección      | El marcador cae y se asienta                                                   |
| Página de acceso          | La entrada se imprime de arriba abajo                                          |

Con `prefers-reduced-motion: reduce`, todo queda en su estado final.

## Components

- **Botones:** primario (tinta → ultramar), secundario (borde `edge`), fantasma, e **inverso** para la sala oscura (claro → luz). 44px de alto; en táctil, también el pequeño.
- **Campos:** etiqueta visible encima, borde `edge`, error debajo enlazado con `aria-describedby` y `aria-invalid`; tras un envío con errores, el foco va al primer campo inválido.
- **Navegación:** una barra ultramar crece desde la izquierda al pasar y se queda en la página actual (`aria-current`).
- **Cuenta en la cabecera:** inicial en un círculo ultramar y el nombre; mientras se lee la sesión, un hueco del mismo tamaño (sin texto engañoso).

## Do's and Don'ts

### Do

- Dejar más espacio a la imagen que a la interfaz.
- Usar la cartela (título en cursiva, artista, fecha) con puntuación de frase.
- Diseñar carga, vacío y error en cada vista.

### Don't

- Tarjetas con sombra, gradientes decorativos, antetítulos en mayúsculas, `·` ni `→`.
- Usar la luz como color de fondo o de texto de lectura.
- Animaciones de entrada en cada sección o que no respondan a nada.
- Colores de marca del museo: Galería no se hace pasar por el Art Institute.
