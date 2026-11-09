import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "../Button";
import type { ZoomCommand } from "./keyboard";
import { MAX_SCALE, MIN_SCALE } from "./zoomState";

type ZoomToolbarProps = {
  scale: number;
  onCommand: (command: ZoomCommand) => void;
  controls: string;
};

/** Botones visibles: el visor no depende de conocer los atajos de teclado. */
export function ZoomToolbar({ scale, onCommand, controls }: ZoomToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Controles de zoom"
      aria-controls={controls}
      className="flex gap-1"
    >
      <Button
        variant="ghost"
        size="sm"
        aria-label="Alejar"
        aria-keyshortcuts="-"
        disabled={scale <= MIN_SCALE}
        onClick={() => onCommand({ type: "zoomOut" })}
      >
        <Minus aria-hidden="true" className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Acercar"
        aria-keyshortcuts="+"
        disabled={scale >= MAX_SCALE}
        onClick={() => onCommand({ type: "zoomIn" })}
      >
        <Plus aria-hidden="true" className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-keyshortcuts="0"
        disabled={scale === MIN_SCALE}
        onClick={() => onCommand({ type: "reset" })}
      >
        <RotateCcw aria-hidden="true" className="size-4" />
        Restablecer
      </Button>
    </div>
  );
}
