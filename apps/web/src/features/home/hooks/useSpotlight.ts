"use client";

import { useEffect, type RefObject } from "react";
import {
  approach,
  hasSettled,
  pointerToSpot,
  RESTING_SPOT,
  type SpotPoint,
} from "../lib/spotlight";

/** Solo con ratón o lápiz y si la persona no ha pedido reducir el movimiento. */
const CAN_FOLLOW = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Pinta el foco en la superficie (en %) y, en coordenadas locales (px), en cada elemento
 * marcado con data-spot-local: así una máscara dentro de ese elemento sabe dónde cae la luz.
 */
function paint(surface: HTMLElement, spot: SpotPoint) {
  surface.style.setProperty("--spot-x", `${spot.x.toFixed(2)}%`);
  surface.style.setProperty("--spot-y", `${spot.y.toFixed(2)}%`);
  const room = surface.getBoundingClientRect();
  const x = room.left + (spot.x / 100) * room.width;
  const y = room.top + (spot.y / 100) * room.height;
  surface.querySelectorAll<HTMLElement>("[data-spot-local]").forEach((target) => {
    const box = target.getBoundingClientRect();
    target.style.setProperty("--lx", `${(x - box.left).toFixed(1)}px`);
    target.style.setProperty("--ly", `${(y - box.top).toFixed(1)}px`);
  });
}

/**
 * Hace que el foco de la sala siga al puntero con inercia.
 * Escribe variables CSS en la superficie (sin re-renderizar React) y solo pide
 * fotogramas mientras el foco se mueve.
 */
export function useSpotlight(surfaceRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    // Siempre se pinta la posición de reposo: también sin ratón o con movimiento reducido.
    paint(surface, RESTING_SPOT);
    if (!window.matchMedia(CAN_FOLLOW).matches) return;

    let current = RESTING_SPOT;
    let target = RESTING_SPOT;
    let frame = 0;

    const tick = () => {
      current = approach(current, target);
      paint(surface, current);
      frame = hasSettled(current, target) ? 0 : requestAnimationFrame(tick);
    };
    const moveTo = (next: SpotPoint) => {
      target = next;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) =>
      moveTo(pointerToSpot(event.clientX, event.clientY, surface.getBoundingClientRect()));
    const onLeave = () => moveTo(RESTING_SPOT);

    surface.addEventListener("pointermove", onMove);
    surface.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerleave", onLeave);
    };
  }, [surfaceRef]);
}
