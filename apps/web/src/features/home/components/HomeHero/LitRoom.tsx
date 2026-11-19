"use client";

import { useRef, type ReactNode } from "react";
import { useSpotlight } from "../../hooks/useSpotlight";
import "./sala.css";

type LitRoomProps = { labelledBy: string; children: ReactNode };

/** Sala en penumbra con un foco que sigue al puntero. El contenido llega del servidor. */
export function LitRoom({ labelledBy, children }: LitRoomProps) {
  const ref = useRef<HTMLElement>(null);
  useSpotlight(ref);
  return (
    <section ref={ref} aria-labelledby={labelledBy} className="sala">
      <div aria-hidden="true" className="sala-luz" />
      {children}
    </section>
  );
}
