import type { CSSProperties, KeyboardEvent, RefObject } from "react";
import { cn } from "../../lib/cn";
import type { ZoomState } from "./zoomState";

type ZoomViewportProps = {
  viewportRef: RefObject<HTMLDivElement | null>;
  id: string;
  helpId: string;
  state: ZoomState;
  gesturing: boolean;
  image: { src: string; srcSet?: string; width: number | null; height: number | null; alt: string };
  placeholder?: string | null;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

/** Área enfocable donde se ve y se mueve la imagen. */
export function ZoomViewport({
  viewportRef,
  id,
  helpId,
  state,
  gesturing,
  image,
  placeholder,
  onKeyDown,
}: ZoomViewportProps) {
  const zoomed = state.scale > 1;
  const ratio = image.width && image.height ? image.width / image.height : 4 / 5;
  const sizes = `(min-width: 1024px) ${Math.ceil(58 * state.scale)}vw, ${Math.ceil(100 * state.scale)}vw`;
  const style = {
    "--ratio": String(ratio),
    ...(placeholder ? { backgroundImage: `url("${placeholder}")`, backgroundSize: "cover" } : {}),
  } as CSSProperties;

  return (
    // role="application" es enfocable y recibe teclas según ARIA; jsx-a11y no lo reconoce como interactivo.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={viewportRef}
      id={id}
      role="application"
      aria-roledescription="visor de zoom"
      aria-label={image.alt}
      aria-describedby={helpId}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        "relative mx-auto aspect-(--ratio) max-h-[80vh] w-full max-w-full overflow-hidden bg-placeholder select-none",
        zoomed ? "cursor-grab touch-none active:cursor-grabbing" : "touch-pan-y",
      )}
      style={style}
    >
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        width={image.width ?? undefined}
        height={image.height ?? undefined}
        alt=""
        draggable={false}
        fetchPriority="high"
        className={cn(
          "block h-full w-full object-contain will-change-transform",
          !gesturing && "transition-transform duration-300 ease-out-expo",
        )}
        style={{ transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})` }}
      />
    </div>
  );
}
