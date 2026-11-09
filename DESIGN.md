---
name: Galería
description: Sala de museo digital para la colección del Art Institute of Chicago.
colors:
  wall: "#f4f1ea"
  surface: "#fbfaf7"
  ink: "#1c1b18"
  ink-muted: "#5e5a52"
  line: "#d9d3c7"
  accent: "#7b2d26"
  accent-ink: "#fbfaf7"
  danger: "#8f1d1d"
  placeholder: "#e7e2d8"
  wall-dark: "#141311"
  surface-dark: "#1c1b18"
  ink-dark: "#ede8df"
  ink-muted-dark: "#a39c90"
  line-dark: "#34312c"
  accent-dark: "#d99a8c"
typography:
  display:
    fontFamily: "Newsreader, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.6rem + 3.6vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  artwork-title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  control: "2px"
spacing:
  gutter: "24px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  button-secondary:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 20px"
  artwork-card-label:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
---

# Design System: Galería

## Overview

**Sala de museo.** La interfaz es la pared: cálida, silenciosa y al servicio de la obra. Nada compite con la imagen. La personalidad está en los detalles que se notan al usar (la cartela, el foco, la selección de texto), no en adornos. Modo de superficie: **Experience** en portada, búsqueda y obra; **Operate** en filtros y colecciones.

## Colors

### Primary

- **Burdeos de sala** (`accent`, `#7b2d26` / oscuro `#d99a8c`): el único color con intención. Enlaces al pasar el ratón, anillo de foco, selección de texto y estado activo. Nunca como fondo de grandes superficies.

### Neutral

- **Yeso** (`wall`): fondo de página, como la pared de una sala.
- **Superficie** (`surface`): formularios y visor; un paso por encima de la pared.
- **Tinta** (`ink`): texto y botón primario.
- **Tinta atenuada** (`ink-muted`): cartelas y metadatos. 6,3:1 sobre `wall`.
- **Línea** (`line`): separadores de 1px.

### Named Rules

- **Una sola nota de color.** El acento aparece en interacción, no en decoración.
- **Modo oscuro = sala oscura**, no un negro puro: `#141311` cálido, con la misma jerarquía.

## Typography

**Newsreader** (serif editorial, variable) para títulos y nombres de obra, siempre en cursiva cuando es el título de una obra, como en una cartela. **Instrument Sans** (grotesca sobria) para lectura, controles y metadatos. Ambas se sirven desde el propio sitio (`next/font/local`), con fallback ajustado para no provocar saltos de diseño.

### Hierarchy

- `display` para el nombre del sitio y títulos de página.
- `title` para encabezados de sección y estados vacíos o de error.
- `artwork-title` (cursiva) para títulos de obra en cuadrícula.
- `body` con medida máxima de 65–75 caracteres.
- `label` para cartelas (artista, fecha, técnica) con cifras tabulares.

## Layout

Cuadrícula de 1 columna en móvil, 2 en tablet y 3–4 en escritorio, con separación generosa (`gap-x-8 gap-y-12`). Las imágenes conservan su proporción real: la cuadrícula se alinea arriba, como obras colgadas a la misma altura. Márgenes laterales de 16px en móvil y 24–48px en escritorio.

## Elevation & Depth

Plano. No hay sombras ni tarjetas: la profundidad viene del tamaño y del espacio. El visor de zoom es la única superficie elevada (`surface` con borde `line`).

## Shapes

Esquinas de 2px en controles. Imágenes sin redondear: una obra no tiene esquinas redondeadas.

## Components

### Buttons

Primario en tinta sobre yeso; al pasar el ratón cambia a burdeos. Secundario con borde de 1px. Fantasma para acciones terciarias (restablecer zoom). Estado de carga con indicador y `aria-busy`.

### Cards / Containers

`ArtworkCard`: imagen + cartela debajo (título en cursiva, artista, fecha). Toda la tarjeta es clicable con el patrón de enlace estirado; el enlace se nombra solo con el título.

### Inputs / Fields

Etiqueta visible siempre encima del campo. Fondo `surface`, borde `line`, foco con el anillo burdeos.

### Navigation

Cabecera sobria: nombre del sitio en `display` reducido y enlaces de texto. El enlace activo se marca con subrayado burdeos y `aria-current`.

## Do's and Don'ts

### Do:

- Dejar más espacio a la imagen que a la interfaz.
- Usar la cartela (título en cursiva, artista, fecha) como único patrón de metadatos.
- Diseñar los estados de carga, vacío y error de cada vista.

### Don't:

- Tarjetas con sombra, gradientes o etiquetas sobre los títulos.
- Colores de marca del museo: Galería no se hace pasar por el Art Institute.
- Animaciones que compitan con la obra. El único momento animado es la aparición nítida de la imagen sobre su placeholder.
