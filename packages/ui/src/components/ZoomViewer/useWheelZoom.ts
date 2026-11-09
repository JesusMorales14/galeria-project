import { useEffect, useEffectEvent, type RefObject } from "react";
import { fromCenter } from "./geometry";
import type { Point } from "./zoomState";

/**
 * Zoom con la rueda solo si se pulsa Ctrl/⌘ (o con el pellizco del trackpad, que lo emula).
 * La rueda sola sigue desplazando la página: el visor no secuestra el scroll.
 */
export function useWheelZoom(
  ref: RefObject<HTMLElement | null>,
  onZoom: (factor: number, origin: Point) => void,
) {
  const zoom = useEffectEvent(onZoom);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoom(
        Math.exp(-event.deltaY * 0.01),
        fromCenter(element, { x: event.clientX, y: event.clientY }),
      );
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [ref]);
}
