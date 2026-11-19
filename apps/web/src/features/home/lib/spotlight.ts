/** Posición del foco en porcentaje del contenedor (0–100 en cada eje). */
export type SpotPoint = { x: number; y: number };

type Rect = Pick<DOMRect, "left" | "top" | "width" | "height">;

/** Posición inicial: sobre la obra, que cuelga a la izquierda y arriba. */
export const RESTING_SPOT: SpotPoint = { x: 34, y: 42 };

const clamp = (value: number) => Math.min(100, Math.max(0, value));

/** Convierte la posición del puntero en coordenadas relativas al contenedor. */
export function pointerToSpot(clientX: number, clientY: number, rect: Rect): SpotPoint {
  if (rect.width === 0 || rect.height === 0) return RESTING_SPOT;
  return {
    x: clamp(((clientX - rect.left) / rect.width) * 100),
    y: clamp(((clientY - rect.top) / rect.height) * 100),
  };
}

/** Acerca el foco a su destino una fracción por fotograma: movimiento con inercia. */
export function approach(current: SpotPoint, target: SpotPoint, factor = 0.12): SpotPoint {
  return {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
  };
}

/** El foco ha llegado cuando la distancia es imperceptible: deja de pedir fotogramas. */
export function hasSettled(current: SpotPoint, target: SpotPoint, epsilon = 0.05): boolean {
  return Math.abs(target.x - current.x) < epsilon && Math.abs(target.y - current.y) < epsilon;
}
