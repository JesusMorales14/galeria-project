import type { Point } from "./zoomState";

export type ZoomCommand =
  | { type: "zoomIn" }
  | { type: "zoomOut" }
  | { type: "reset" }
  /** Dirección hacia la que se desplaza la imagen (en unidades de paso). */
  | { type: "pan"; direction: Point };

const COMMANDS: Record<string, ZoomCommand> = {
  "+": { type: "zoomIn" },
  "=": { type: "zoomIn" },
  "-": { type: "zoomOut" },
  _: { type: "zoomOut" },
  "0": { type: "reset" },
  // Ver más hacia una dirección = mover la imagen en sentido contrario.
  ArrowRight: { type: "pan", direction: { x: -1, y: 0 } },
  ArrowLeft: { type: "pan", direction: { x: 1, y: 0 } },
  ArrowDown: { type: "pan", direction: { x: 0, y: -1 } },
  ArrowUp: { type: "pan", direction: { x: 0, y: 1 } },
};

/** Traduce una tecla a una orden del visor. null = la tecla no es del visor (Tab sigue funcionando). */
export function keyToCommand(key: string): ZoomCommand | null {
  return COMMANDS[key] ?? null;
}
