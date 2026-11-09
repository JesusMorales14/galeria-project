"use client";

import { useState } from "react";
import type { ArtworkSummary } from "@galeria/api-client";
import { cn, LiveRegion } from "@galeria/ui";
import { ArtworkTile } from "@/shared/artwork";
import { ReorderControls } from "./ReorderControls";

type Props = {
  artworks: ArtworkSummary[];
  onMove: (artworkId: number, toIndex: number) => Promise<unknown>;
  onRemove: (artworkId: number) => Promise<unknown>;
};

/** Lista ordenable: arrastrar con el ratón o usar los botones; cada cambio se anuncia. */
export function SortableArtworkList({ artworks, onMove, onRemove }: Props) {
  const [dragged, setDragged] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");

  async function move(artwork: ArtworkSummary, toIndex: number, focusKey?: string) {
    await onMove(artwork.id, toIndex);
    setAnnouncement(`«${artwork.title}» movida a la posición ${toIndex + 1} de ${artworks.length}`);
    // Tras reordenar, el foco sigue en el mismo botón para poder repetir la acción.
    if (focusKey)
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>(`[data-move="${focusKey}"]`)?.focus(),
      );
  }

  return (
    <>
      <ol className="grid grid-cols-1 items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artworks.map((artwork, index) => (
          <li
            key={artwork.id}
            draggable
            onDragStart={() => setDragged(artwork.id)}
            onDragEnd={() => setDragged(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              const source = artworks.find((item) => item.id === dragged);
              if (source && source.id !== artwork.id) void move(source, index);
            }}
            className={cn("flex flex-col gap-3", dragged === artwork.id && "opacity-50")}
          >
            <ArtworkTile artwork={artwork} headingLevel={2} />
            <ReorderControls
              title={artwork.title}
              index={index}
              total={artworks.length}
              artworkId={artwork.id}
              onMove={(to) => void move(artwork, to, `${artwork.id}-${to < index ? "up" : "down"}`)}
              onRemove={() => {
                void onRemove(artwork.id);
                setAnnouncement(`«${artwork.title}» quitada de la colección`);
              }}
            />
          </li>
        ))}
      </ol>
      <LiveRegion visuallyHidden>{announcement}</LiveRegion>
    </>
  );
}
