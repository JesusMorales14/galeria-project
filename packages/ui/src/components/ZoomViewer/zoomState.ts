/**
 * Estado del visor de zoom: lógica pura, sin DOM ni React.
 * La imagen se transforma con translate(x, y) scale(scale) desde su centro.
 */
export type ZoomState = { scale: number; x: number; y: number };
export type Size = { width: number; height: number };
export type Point = { x: number; y: number };

export type ZoomAction =
  | { type: "zoomIn"; bounds: Size }
  | { type: "zoomOut"; bounds: Size }
  /** Zoom hacia un punto (relativo al centro del visor), p. ej. rueda o pellizco. */
  | { type: "zoomTo"; scale: number; origin?: Point; bounds: Size }
  | { type: "pan"; dx: number; dy: number; bounds: Size }
  | { type: "reset" };

export const MIN_SCALE = 1;
export const MAX_SCALE = 6;
export const ZOOM_STEP = 1.5;

export const initialZoomState: ZoomState = { scale: 1, x: 0, y: 0 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value * 1000) / 1000;

/** Mantiene la imagen cubriendo el visor: nunca se ve un hueco en los bordes. */
function clampOffset(state: ZoomState, bounds: Size): ZoomState {
  const maxX = ((state.scale - 1) * bounds.width) / 2;
  const maxY = ((state.scale - 1) * bounds.height) / 2;
  return {
    scale: state.scale,
    x: clamp(state.x, -maxX, maxX) || 0,
    y: clamp(state.y, -maxY, maxY) || 0,
  };
}

type ZoomTarget = { scale: number; origin: Point };

function zoomAround(state: ZoomState, target: ZoomTarget, bounds: Size): ZoomState {
  const { origin } = target;
  const scale = round(clamp(target.scale, MIN_SCALE, MAX_SCALE));
  const ratio = scale / state.scale;
  // El punto del contenido bajo `origin` sigue bajo `origin` tras el zoom.
  const x = origin.x - (origin.x - state.x) * ratio;
  const y = origin.y - (origin.y - state.y) * ratio;
  return clampOffset({ scale, x, y }, bounds);
}

const CENTER: Point = { x: 0, y: 0 };

export function zoomReducer(state: ZoomState, action: ZoomAction): ZoomState {
  switch (action.type) {
    case "zoomIn":
      return zoomAround(state, { scale: state.scale * ZOOM_STEP, origin: CENTER }, action.bounds);
    case "zoomOut":
      return zoomAround(state, { scale: state.scale / ZOOM_STEP, origin: CENTER }, action.bounds);
    case "zoomTo":
      return zoomAround(
        state,
        { scale: action.scale, origin: action.origin ?? CENTER },
        action.bounds,
      );
    case "pan":
      return clampOffset(
        { ...state, x: state.x + action.dx, y: state.y + action.dy },
        action.bounds,
      );
    case "reset":
      return initialZoomState;
  }
}

/** Texto que se anuncia al lector de pantalla. */
export function zoomLabel(scale: number): string {
  return `Zoom ${Math.round(scale * 100)} %`;
}
