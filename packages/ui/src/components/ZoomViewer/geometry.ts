import type { Point, Size } from "./zoomState";

/** Posición de un punto de pantalla relativa al centro del elemento. */
export function fromCenter(element: Element, point: Point): Point {
  const rect = element.getBoundingClientRect();
  return { x: point.x - rect.left - rect.width / 2, y: point.y - rect.top - rect.height / 2 };
}

export function sizeOf(element: Element | null): Size {
  const rect = element?.getBoundingClientRect();
  return { width: rect?.width ?? 0, height: rect?.height ?? 0 };
}

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
export const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
