/**
 * Confirmación al guardar: el marcador cae y se asienta, como una chincheta.
 * Web Animations API sobre el elemento: no toca el estado de React (cero renders) y
 * no se ejecuta si la persona ha pedido reducir el movimiento.
 */
const KEYFRAMES: Keyframe[] = [
  { transform: "translateY(-40%) scale(0.6)" },
  { transform: "translateY(8%) scale(1.15)", offset: 0.6 },
  { transform: "none" },
];

export function playPinAnimation(element: Element | null) {
  if (!element?.animate) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  element.animate(KEYFRAMES, { duration: 520, easing: "cubic-bezier(0.34, 1.4, 0.64, 1)" });
}
