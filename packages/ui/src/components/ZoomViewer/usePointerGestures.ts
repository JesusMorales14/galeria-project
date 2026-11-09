import { useEffect, useEffectEvent, type RefObject } from "react";
import { distance, fromCenter, midpoint } from "./geometry";
import type { Point } from "./zoomState";

type Handlers = {
  /** Arrastre con un dedo o el ratón (solo cuando hay zoom). */
  onPan: (dx: number, dy: number) => void;
  /** Pellizco con dos dedos: factor de escala y punto medio relativo al centro. */
  onPinch: (factor: number, origin: Point) => void;
  onGestureChange: (active: boolean) => void;
  canPan: () => boolean;
};

/** Arrastre y pellizco con Pointer Events (ratón, lápiz y táctil con el mismo código). */
export function usePointerGestures(ref: RefObject<HTMLElement | null>, handlers: Handlers) {
  const canPan = useEffectEvent(handlers.canPan);
  const onPan = useEffectEvent(handlers.onPan);
  const onPinch = useEffectEvent(handlers.onPinch);
  const onGestureChange = useEffectEvent(handlers.onGestureChange);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const pointers = new Map<number, Point>();
    let pinchDistance = 0;

    const pinch = (a: Point, b: Point) => {
      const next = distance(a, b);
      if (pinchDistance > 0) onPinch(next / pinchDistance, fromCenter(element, midpoint(a, b)));
      pinchDistance = next;
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && !canPan()) return;
      element.setPointerCapture?.(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      onGestureChange(true);
    };

    const onMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const current = { x: event.clientX, y: event.clientY };
      pointers.set(event.pointerId, current);
      const [a, b] = [...pointers.values()];
      if (a && b) return pinch(a, b);
      if (canPan()) onPan(current.x - previous.x, current.y - previous.y);
    };

    const onUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      pinchDistance = 0;
      if (pointers.size === 0) onGestureChange(false);
    };

    const listeners = {
      pointerdown: onDown,
      pointermove: onMove,
      pointerup: onUp,
      pointercancel: onUp,
    };
    Object.entries(listeners).forEach(([type, listener]) =>
      element.addEventListener(type, listener as EventListener),
    );
    return () =>
      Object.entries(listeners).forEach(([type, listener]) =>
        element.removeEventListener(type, listener as EventListener),
      );
  }, [ref]);
}
