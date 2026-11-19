import { useEffect, useReducer, useRef, type RefObject } from "react";
import { initialZoomState, zoomReducer, type ZoomAction, type ZoomState } from "./zoomState";

/** Tras la última vuelta de la rueda, cuánto esperar para dar el zoom por terminado. */
export const WHEEL_SETTLE_MS = 150;

export const transformOf = ({ x, y, scale }: ZoomState) =>
  `translate(${x}px, ${y}px) scale(${scale})`;

/**
 * Estado del zoom en dos velocidades:
 * - `preview`: durante un gesto continuo (arrastre, pellizco, rueda) el reducer calcula el
 *   siguiente estado y se escribe directamente en el `style` de la imagen. Cero renders de
 *   React por evento de puntero.
 * - `commit`: al terminar el gesto, un único render lleva ese estado a React (nivel de zoom
 *   anunciado, botones deshabilitados, `sizes` para pedir la imagen grande).
 * Las órdenes discretas (botones y teclado) aplican y confirman a la vez: un render por acción.
 */
export function useLiveZoom(imageRef: RefObject<HTMLImageElement | null>) {
  const [state, setState] = useReducer(
    (_previous: ZoomState, next: ZoomState) => next,
    initialZoomState,
  );
  const live = useRef(state);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(settle.current), []);

  const preview = (action: ZoomAction) => {
    live.current = zoomReducer(live.current, action);
    if (imageRef.current) imageRef.current.style.transform = transformOf(live.current);
  };

  const commit = () => {
    clearTimeout(settle.current);
    setState(live.current); // si no cambió (misma referencia), React no vuelve a renderizar
  };

  return {
    state,
    /** Cuánto zoom hay ahora mismo, aunque React aún no lo sepa (para gestos encadenados). */
    current: () => live.current,
    preview,
    commit,
    apply: (action: ZoomAction) => {
      preview(action);
      commit();
    },
    /** Para la rueda: no hay evento de «fin», se confirma cuando deja de girar. */
    commitSoon: () => {
      clearTimeout(settle.current);
      settle.current = setTimeout(commit, WHEEL_SETTLE_MS);
    },
  };
}
