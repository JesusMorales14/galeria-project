"use client";

import { useId } from "react";
import { cn } from "../../lib/cn";
import { LiveRegion } from "../VisuallyHidden";
import { useZoomViewer } from "./useZoomViewer";
import { ZoomToolbar } from "./ZoomToolbar";
import { ZoomViewport } from "./ZoomViewport";
import { zoomLabel } from "./zoomState";

export type ZoomViewerProps = {
  src: string;
  srcSet?: string;
  width: number | null;
  height: number | null;
  alt: string;
  /** Nombre de la obra, para el nombre accesible del visor. */
  title: string;
  placeholder?: string | null;
  className?: string;
};

/**
 * Visor de zoom accesible: botones, teclado (+, −, flechas, 0), Ctrl + rueda,
 * arrastre y pellizco. Anuncia el nivel de zoom y no bloquea el scroll sin zoom.
 */
export function ZoomViewer({ title, placeholder, className, ...image }: ZoomViewerProps) {
  const { state, run, onKeyDown, viewportRef, gesturing } = useZoomViewer();
  const id = useId();

  return (
    <section
      aria-label={`Visor de zoom: ${title}`}
      className={cn("flex flex-col gap-3", className)}
    >
      <ZoomViewport
        viewportRef={viewportRef}
        id={`${id}-viewport`}
        helpId={`${id}-help`}
        state={state}
        gesturing={gesturing}
        image={image}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ZoomToolbar scale={state.scale} onCommand={run} controls={`${id}-viewport`} />
        <LiveRegion className="text-label text-ink-muted tabular-nums">
          {zoomLabel(state.scale)}
        </LiveRegion>
      </div>
      <p id={`${id}-help`} className="text-label text-ink-muted">
        Con el visor seleccionado: <kbd>+</kbd> y <kbd>−</kbd> acercan o alejan, las flechas mueven
        la vista y <kbd>0</kbd> restablece. También puedes usar Ctrl + rueda, arrastrar o pellizcar.
      </p>
    </section>
  );
}
