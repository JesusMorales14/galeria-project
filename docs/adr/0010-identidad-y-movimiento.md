# 0010 · Identidad «sala iluminada» y movimiento con motivo

- **Estado:** aceptada (sustituye la dirección visual de la fase de pulido del 2026-11-10)
- **Fecha:** 2026-11-17

## Contexto

La dirección anterior (yeso crema, serif de alto contraste y acento burdeos) era sobria, pero coincidía con el patrón más repetido del diseño generado por IA. Para un portfolio de frontend, una interfaz indistinguible de una plantilla resta. Además se pidió una experiencia más dinámica, sin perder accesibilidad ni rendimiento.

## Decisión

**Identidad anclada en el tema** (detalle en [`DESIGN.md`](../../DESIGN.md)):

- Pared gris de Payne fría, un acento ultramar y una luz cálida (amarillo de Nápoles) que solo existe como foco.
- **Big Shoulders**, la tipografía cívica de Chicago, para rótulos y controles; **Newsreader** para lectura y títulos de obra.
- La portada es una sala en penumbra: la obra bajo un foco y el nombre como estandarte vertical de fachada.
- Las destacadas se cuelgan «a la manera de salón» (columnas apretadas, cada obra con su proporción).
- El acceso es una entrada de museo con talón perforado.

**Movimiento con reglas:**

1. Un solo momento orquestado por página (la sala se enciende; la entrada se imprime). Nada de entradas «fade-and-slide» en cada sección.
2. El resto responde a la persona: el foco sigue al puntero, la luz cae sobre la obra que se mira, el marcador late al guardar, la imagen viaja de la miniatura a la ficha.
3. Solo se animan `transform`, `opacity`, `filter`, `clip-path` y máscaras: nada que provoque reflujo.
4. `prefers-reduced-motion: reduce` deja todo en su estado final; el foco no sigue al puntero en pantallas táctiles.
5. Mejora progresiva: sin `animation-timeline` o sin View Transitions, el contenido está igual de completo.

| Animación                                  | Técnica                                                                                                   | Coste en JS |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ----------- |
| Encendido de la sala, rótulo letra a letra | `@keyframes` con retardos escalonados                                                                     | 0           |
| Foco que sigue al puntero                  | `requestAnimationFrame` con inercia, escribe variables CSS (sin re-render de React); se detiene al llegar | ~1 KB       |
| Cuadros que se asientan al hacer scroll    | `animation-timeline: view()`                                                                              | 0           |
| Miniatura → ficha                          | React `<ViewTransition>` con `share` y `default="none"`                                                   | 0 (React)   |
| Marcador al guardar                        | Web Animations API sobre la ref del icono, solo tras una acción (sin estado de React)                     | 0           |

## Opciones descartadas

- **Framer Motion / GSAP:** +30–60 KB de JavaScript para efectos que CSS y la plataforma ya resuelven; el presupuesto es de 200 KB.
- **Smooth scroll con JavaScript:** secuestra el scroll y empeora la accesibilidad.
- **CSS Modules para los estilos de animación:** la regla de Turbopack que procesa Tailwind trata todo `*.css` como global; se usan hojas globales con clases prefijadas (`sala-*`, `salon-*`, `entrada-*`) importadas desde su componente.

## Consecuencias

- La identidad se puede defender pieza a pieza con el tema (museo, Chicago, pigmentos), no con gustos.
- Los contrastes se recalcularon: tinta 12,5:1, cartelas 5,9:1, ultramar 6,7:1; los bordes de controles usan `edge` (≥ 3:1, WCAG 1.4.11), que antes no cumplían.
- El movimiento no añade dependencias ni JavaScript relevante al bundle.
