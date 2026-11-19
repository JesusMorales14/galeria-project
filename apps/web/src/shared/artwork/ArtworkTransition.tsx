import { ViewTransition, type ReactNode } from "react";

/** Nombre compartido por la miniatura y la imagen de la ficha de una misma obra. */
export const artworkTransitionName = (id: number) => `obra-${id}`;

/** Clase de la transición: globals.css define su duración y su curva. */
export const ARTWORK_TRANSITION_CLASS = "obra-viaja";

export const artworkTransition = (id: number) => ({
  name: artworkTransitionName(id),
  className: ARTWORK_TRANSITION_CLASS,
});

/**
 * Marca la imagen de una obra para que el navegador la haga viajar entre páginas
 * (cuadrícula → ficha) con la View Transitions API. Sin soporte, no pasa nada.
 * `default="none"` evita que la imagen se anime en transiciones que no le afectan.
 */
export function ArtworkTransition({ id, children }: { id: number; children: ReactNode }) {
  return (
    <ViewTransition
      name={artworkTransitionName(id)}
      share={ARTWORK_TRANSITION_CLASS}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
