# Plan · «Sala iluminada»: rediseño, movimiento y cuentas

> Brief (2026-11-17): dejar el proyecto listo para una postulación como frontend developer. Diseño innovador, sin la estética repetitiva de IA, con animaciones que hagan la experiencia más dinámica; además, autenticación con tokens, accesibilidad, seguridad y buenas prácticas.

## 1. Diagnóstico

La dirección anterior («sala de museo»: yeso crema `#f4f1ea`, serif de alto contraste, acento burdeos) coincide punto por punto con el **primer rasgo genérico** que señala la skill `frontend-design` (fondo crema + serif + acento arcilla). Era sobria, pero indistinguible de cualquier página generada. Se cambia la identidad conservando los principios de producto (la obra primero, accesible de verdad, el enlace es el estado).

## 2. Concepto

**La sala se ilumina.** Un museo no es una pared beis: es una sala pintada de un color frío, en penumbra, donde cada obra recibe su propio foco. Y esta colección es la de **Chicago**: la fachada del Art Institute cuelga estandartes con tipografía condensada entre sus leones.

| Decisión    | Elección                                                                                                            | Por qué (anclada en el tema)                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Pared       | Gris de Payne `#dfe3de` (día) / `#141a20` (noche)                                                                   | El gris de Payne es un pigmento de pintor; las salas de museo se pintan en tonos fríos para que la obra caliente |
| Acento      | Azul ultramar `#2b3bb8` / `#9aa6ff`                                                                                 | El pigmento más caro de la historia de la pintura: el único color con intención (foco, enlace, estado activo)    |
| Luz         | Amarillo de Nápoles `#f3cf7a`                                                                                       | Solo como luz (el foco que cae sobre la obra), nunca como superficie ni texto                                    |
| Display     | **Big Shoulders** (variable, eje óptico)                                                                            | Tipografía cívica de la ciudad de Chicago: titulares como estandartes de fachada                                 |
| Lectura     | **Newsreader** (cursiva para títulos de obra)                                                                       | La cartela de museo: el título de una obra va en cursiva                                                         |
| Disposición | Héroe en sala oscura a sangre; destacadas en **colgado de salón** (columnas apretadas, cada obra con su proporción) | El _salon hang_ es cómo los museos del XIX colgaban la colección: muchas obras, juntas, sin recortar ninguna     |

## 3. Revisión contra los rasgos genéricos

| Rasgo genérico                                  | Situación nueva                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Crema + serif + acento arcilla                  | Eliminado: pared fría, display condensado, ultramar                                         |
| Negro con un único acento ácido                 | La sala oscura es gris de Payne con luz cálida y ultramar: dos notas, cada una con papel    |
| Tarjetas idénticas con sombra y gradientes      | Sin tarjetas; la única «luz» es el foco sobre la obra                                       |
| Antetítulos en mayúsculas, `·`, `→`, numeración | No hay                                                                                      |
| Entradas con fade-and-slide en cada sección     | No: un solo momento orquestado (la sala se enciende) y movimiento que responde a la persona |

## 4. Movimiento (cada animación tiene un motivo)

| Momento                   | Qué pasa                                                                          | Motivo                                 | Técnica                                          |
| ------------------------- | --------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| Carga de la portada       | La sala se enciende: el foco se abre sobre la obra y el rótulo sube letra a letra | Único momento orquestado del sitio     | CSS (`@keyframes`, retardos escalonados)         |
| Puntero sobre el héroe    | El foco sigue al puntero con inercia                                              | La persona «mira» la sala              | `requestAnimationFrame` + variables CSS          |
| Scroll por las destacadas | Cada cuadro se asienta en su clavo (rotación mínima desde arriba)                 | Las obras se cuelgan al llegar a ellas | `animation-timeline: view()` (mejora progresiva) |
| Miniatura → ficha         | La imagen viaja de la cuadrícula a la ficha                                       | Continuidad: es la misma obra          | React `<ViewTransition>`                         |
| Guardar en colección      | El marcador se rellena con un pulso                                               | Confirma la acción                     | CSS                                              |

Con `prefers-reduced-motion: reduce` todo queda en su estado final, sin desplazamientos.

## 5. Cuentas (autenticación con tokens)

Ver [ADR 0009](../../adr/0009-autenticacion-con-tokens.md). Resumen: Server Actions para entrar, registrarse y salir; token de acceso JWT de 15 min y token de refresco rotatorio de 7 días con detección de reutilización, ambos en cookies `HttpOnly`; `proxy.ts` solo comprueba la firma (rápido, sin estado) y la capa de acceso a datos vuelve a verificar en el servidor.
