"use client";

import { useId, ViewTransition, type ReactNode } from "react";
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
  /**
   * Transición entre páginas (View Transitions API) para la imagen, no los controles:
   * con el mismo `name` que la miniatura, la imagen viaja de la cuadrícula al visor.
   */
  transition?: { name: string; className: string };
};

function Frame({
  transition,
  children,
}: Pick<ZoomViewerProps, "transition"> & { children: ReactNode }) {
  if (!transition) return children;
  return (
    <ViewTransition name={transition.name} share={transition.className} default="none">
      {children}
    </ViewTransition>
  );
}

/**
 * Visor de zoom accesible: botones, teclado (+, −, flechas, 0), Ctrl + rueda,
 * arrastre y pellizco. Anuncia el nivel de zoom y no bloquea el scroll sin zoom.
 */
export function ZoomViewer({
  title,
  placeholder,
  className,
  transition,
  ...image
}: ZoomViewerProps) {
  const { state, run, onKeyDown, viewportRef, imageRef } = useZoomViewer();
  const id = useId();

  return (
    <section
      aria-label={`Visor de zoom: ${title}`}
      className={cn("flex flex-col gap-3", className)}
    >
      <Frame transition={transition}>
        <ZoomViewport
          viewportRef={viewportRef}
          imageRef={imageRef}
          id={`${id}-viewport`}
          helpId={`${id}-help`}
          state={state}
          image={image}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
        />
      </Frame>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ZoomToolbar scale={state.scale} onCommand={run} controls={`${id}-viewport`} />
        <LiveRegion className="font-sans text-label text-ink-muted tabular-nums">
          {zoomLabel(state.scale)}
        </LiveRegion>
      </div>
      <p id={`${id}-help`} className="font-sans text-label text-ink-muted">
        Con el visor seleccionado: <kbd>+</kbd> y <kbd>−</kbd> acercan o alejan, las flechas mueven
        la vista y <kbd>0</kbd> restablece. También puedes usar Ctrl + rueda, arrastrar o pellizcar.
      </p>
    </section>
  );
}
