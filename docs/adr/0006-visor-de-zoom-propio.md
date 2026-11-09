# 0006 · Visor de zoom propio en lugar de OpenSeadragon

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

La página de obra necesita acercar y moverse por la imagen en alta resolución. El requisito clave de la fase es que el visor sea **operable con teclado y lector de pantalla**, respete `prefers-reduced-motion` y no bloquee el scroll de la página en móvil.

## Opciones consideradas

1. **OpenSeadragon** (compatible con IIIF, teselas a resolución completa).
   - A favor: zoom profundo real (miles de píxeles), maduro, lee el `info.json` de IIIF.
   - En contra: ~200 KB de JavaScript, pinta sobre `<canvas>` (para un lector de pantalla es una caja opaca), los controles accesibles hay que reconstruirlos, y la estética de sus controles no encaja con el design system.
2. **Visor propio** sobre la imagen IIIF de 1686 px.
   - A favor: ~4 KB, `<img>` real, control total del teclado, ARIA, foco y movimiento; la lógica es un reducer puro y fácil de probar.
   - En contra: el zoom está limitado por la resolución de la imagen (1686 px, el máximo que el museo recomienda para obras de dominio público con necesidad clara); a 6× se nota el pixelado.

## Decisión

**Visor propio** (`packages/ui/src/components/ZoomViewer`), con la lógica separada de la vista:

- `zoomState.ts`: reducer puro (zoom, desplazamiento con límites, zoom hacia un punto). 13 tests unitarios.
- `keyboard.ts`: tecla → orden (`+`/`=`, `-`/`_`, `0`, flechas).
- `useZoomViewer`, `useWheelZoom`, `usePointerGestures`: conectan el reducer con teclado, Ctrl + rueda, arrastre y pellizco (Pointer Events).
- `ZoomViewer` / `ZoomViewport` / `ZoomToolbar`: presentación. Botones visibles con nombre accesible y `aria-keyshortcuts`, nivel anunciado en una región `aria-live`, instrucciones asociadas con `aria-describedby`.
- Al acercar se amplía `sizes`, y el navegador pide por sí solo la versión de 1686 px con `srcset`.

## Consecuencias

- Accesible por diseño y verificado: todo funciona con teclado (tests y e2e), axe sin violaciones.
- La rueda sola sigue desplazando la página; el zoom con rueda requiere Ctrl/⌘ (el pellizco del trackpad lo emula). Sin zoom, en táctil se permite `pan-y`.
- **Limitación aceptada:** no hay zoom profundo por teselas. Si se necesitara, se podría cambiar la vista por OpenSeadragon conservando `zoomState` y los controles accesibles. Registrado en `TECH_DEBT.md`.
