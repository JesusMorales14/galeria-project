import type { CSSProperties } from "react";
import { Skeleton } from "./Skeleton";

type ArtworkCardSkeletonProps = {
  /** Proporción ancho/alto de la imagen, para que nada salte al cargar. */
  aspectRatio?: number;
};

export function ArtworkCardSkeleton({ aspectRatio = 4 / 5 }: ArtworkCardSkeletonProps) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <Skeleton
        data-skeleton-media=""
        className="aspect-(--ratio)"
        style={{ "--ratio": String(aspectRatio) } as CSSProperties}
      />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-3.5 w-1/2" />
    </div>
  );
}
