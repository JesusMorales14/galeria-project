import { useCallback, useReducer, useRef, useState, type KeyboardEvent } from "react";
import { sizeOf } from "./geometry";
import { keyToCommand, type ZoomCommand } from "./keyboard";
import { usePointerGestures } from "./usePointerGestures";
import { useWheelZoom } from "./useWheelZoom";
import { initialZoomState, zoomReducer, type Point } from "./zoomState";

/** Paso de desplazamiento con flechas: 10 % del visor. */
const PAN_STEP = 0.1;

/** Conecta el estado puro del zoom con teclado, botones, rueda (Ctrl) y gestos. */
export function useZoomViewer() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(zoomReducer, initialZoomState);
  const [gesturing, setGesturing] = useState(false);
  const bounds = () => sizeOf(viewportRef.current);

  const run = useCallback((command: ZoomCommand) => {
    const size = sizeOf(viewportRef.current);
    if (command.type === "reset") return dispatch({ type: "reset" });
    if (command.type === "pan") {
      const { x, y } = command.direction;
      return dispatch({
        type: "pan",
        dx: x * size.width * PAN_STEP,
        dy: y * size.height * PAN_STEP,
        bounds: size,
      });
    }
    dispatch({ type: command.type, bounds: size });
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const command = keyToCommand(event.key);
    if (!command) return;
    event.preventDefault(); // las flechas no deben desplazar la página mientras se usa el visor
    run(command);
  };

  const zoomBy = (factor: number, origin: Point) =>
    dispatch({ type: "zoomTo", scale: state.scale * factor, origin, bounds: bounds() });

  useWheelZoom(viewportRef, zoomBy);
  usePointerGestures(viewportRef, {
    canPan: () => state.scale > 1,
    onPan: (dx, dy) => dispatch({ type: "pan", dx, dy, bounds: bounds() }),
    onPinch: zoomBy,
    onGestureChange: setGesturing,
  });

  return { state, run, onKeyDown, viewportRef, gesturing };
}
