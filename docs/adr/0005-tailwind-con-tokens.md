# 0005 · Tailwind CSS v4 con tokens propios (en lugar de CSS Modules + Sass + BEM)

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

La guía del proyecto proponía CSS Modules + Sass + BEM (deseables de la oferta). La app ya se había creado con Tailwind v4 y se decidió mantenerlo.

## Opciones consideradas

1. **CSS Modules + Sass + BEM:** estilos aislados por archivo, nombres predecibles; cubre directamente esos deseables.
2. **Tailwind v4 con tokens:** utilidades generadas desde un único archivo de tokens; sin nombres que inventar; el CSS final contiene solo lo usado.

## Decisión

Tailwind v4. Los tokens viven en `packages/ui/src/styles/tokens.css` como variables CSS (claro y oscuro) y se exponen con `@theme` (`bg-wall`, `text-ink`, `font-display`…). Los conflictos de clases se resuelven con `tailwind-merge` configurado con los tamaños propios. La app genera las clases del design system con `@source`.

## Consecuencias

- Un único origen de verdad para color, tipografía y forma, documentado en `DESIGN.md` y en Storybook.
- Los componentes siguen siendo pequeños y aislados (una carpeta por componente), que es el beneficio principal de CSS Modules.
- **Coste:** no demuestra Sass ni BEM. Si una oferta lo exige, los tokens ya son variables CSS y se pueden consumir desde CSS Modules sin cambiarlos.
