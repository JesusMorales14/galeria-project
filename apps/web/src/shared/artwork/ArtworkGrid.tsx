import type { ArtworkSummary } from "@galeria/api-client";
import { cn } from "@galeria/ui";
import { preconnectToImages } from "./imageProps";
import { ArtworkTile } from "./ArtworkTile";

type ArtworkGridProps = {
  artworks: ArtworkSummary[];
  /** Cuántas imágenes iniciales cargan con prioridad (las que se ven sin hacer scroll). */
  priorityCount?: number;
  headingLevel?: 2 | 3;
  className?: string;
};

export function ArtworkGrid({
  artworks,
  priorityCount = 0,
  headingLevel,
  className,
}: ArtworkGridProps) {
  const firstImage = artworks.find((artwork) => artwork.image)?.image;
  if (firstImage) preconnectToImages(firstImage);

  return (
    <ul
      className={cn(
        "grid grid-cols-1 items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {artworks.map((artwork, index) => (
        <li key={artwork.id}>
          <ArtworkTile
            artwork={artwork}
            priority={index < priorityCount}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
