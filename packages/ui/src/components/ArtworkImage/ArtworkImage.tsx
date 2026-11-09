import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";

export type ArtworkImageProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width: number | null;
  height: number | null;
  alt: string;
  /** Imagen principal de la página (LCP): carga inmediata y prioridad alta. */
  priority?: boolean;
  /** Imagen diminuta (lqip) que se ve difuminada mientras llega la real. */
  placeholder?: string | null;
  className?: string;
};

const DEFAULT_RATIO = 4 / 5;

function ratioOf(width: number | null, height: number | null): number {
  return width && height ? width / height : DEFAULT_RATIO;
}

/**
 * Imagen de una obra. Reserva su espacio con la proporción real (CLS = 0)
 * y deja que el navegador elija el ancho con srcset/sizes.
 */
export function ArtworkImage({
  src,
  srcSet,
  sizes,
  width,
  height,
  alt,
  priority = false,
  placeholder,
  className,
}: ArtworkImageProps) {
  const style = {
    "--ratio": String(ratioOf(width, height)),
    ...(placeholder ? { backgroundImage: `url("${placeholder}")` } : {}),
  } as CSSProperties;

  return (
    <div
      className={cn("aspect-(--ratio) w-full bg-placeholder bg-cover bg-center", className)}
      style={style}
    >
      {/* <img> nativo: ui no depende de Next.js y IIIF ya entrega el ancho exacto. */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        width={width ?? undefined}
        height={height ?? undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="block h-full w-full object-contain"
      />
    </div>
  );
}
