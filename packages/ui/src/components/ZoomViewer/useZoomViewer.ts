import { useRef, type KeyboardEvent } from "react";
import { sizeOf } from "./geometry";
import { keyToCommand, type ZoomCommand } from "./keyboard";
import { useLiveZoom } from "./useLiveZoom";
import { usePointerGestures } from "./usePointerGestures";
import { useWheelZoom } from "./useWheelZoom";
import type { Point, ZoomAction } from "./zoomState";

/** Paso de desplazamiento con flechas: 10 % del visor. */
const PAN_STEP = 0.1;

function commandToAction(command: ZoomCommand, size: ReturnType<typeof sizeOf>): ZoomAction {
  if (command.type === "reset") return { type: "reset" };
  if (command.type === "pan") {
    const { x, y } = command.direction;
    return {
      type: "pan",
      dx: x * size.width * PAN_STEP,
      dy: y * size.height * PAN_STEP,
      bounds: size,
    };
  }
  return { type: command.type, bounds: size };
}

/** Durante un gesto la imagen no anima su transformación: sigue al dedo sin retraso. */
function markGesture(element: HTMLElement | null, active: boolean) {
  if (active) element?.setAttribute("data-gesturing", "");
  else element?.removeAttribute("data-gesturing");
}

/**
 * Conecta el estado puro del zoom con teclado, botones, rueda (Ctrl) y gestos.
 * Botones y teclado: un render por acción. Gestos continuos: ningún render mientras
 * duran y uno al terminar (ver useLiveZoom).
 */
export function useZoomViewer() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const zoom = useLiveZoom(imageRef);
  const bounds = () => sizeOf(viewportRef.current);

  const run = (command: ZoomCommand) => zoom.apply(commandToAction(command, bounds()));

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const command = keyToCommand(event.key);
    if (!command) return;
    event.preventDefault(); // las flechas no deben desplazar la página mientras se usa el visor
    run(command);
  };

  const zoomBy = (factor: number, origin: Point) =>
    zoom.preview({
      type: "zoomTo",
      scale: zoom.current().scale * factor,
      origin,
      bounds: bounds(),
    });

  useWheelZoom(viewportRef, (factor, origin) => {
    zoomBy(factor, origin);
    zoom.commitSoon();
  });
  usePointerGestures(viewportRef, {
    canPan: () => zoom.current().scale > 1,
    onPan: (dx, dy) => zoom.preview({ type: "pan", dx, dy, bounds: bounds() }),
    onPinch: zoomBy,
    onGestureChange: (active) => {
      markGesture(viewportRef.current, active);
      if (!active) zoom.commit();
    },
  });

  return { state: zoom.state, run, onKeyDown, viewportRef, imageRef };
}
