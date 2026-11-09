"use client";

import { EmptyState, ErrorState } from "@galeria/ui";
import { ArtworkGridSkeleton } from "@/shared/artwork";
import { AppLink } from "@/shared/ui";
import { useArtworksByIds } from "../../hooks/useArtworksByIds";
import type { Collection } from "../../lib/collection";
import { SortableArtworkList } from "./SortableArtworkList";

type Props = {
  collection: Collection;
  onMove: (artworkId: number, toIndex: number) => Promise<unknown>;
  onRemove: (artworkId: number) => Promise<unknown>;
};

export function CollectionArtworks({ collection, onMove, onRemove }: Props) {
  const result = useArtworksByIds(collection.artworkIds);

  if (collection.artworkIds.length === 0) {
    return (
      <EmptyState
        title="Esta colección está vacía"
        description="Abre cualquier obra y pulsa «Guardar en colección»."
        action={<AppLink href="/buscar">Buscar obras</AppLink>}
      />
    );
  }
  if (result.status === "loading")
    return <ArtworkGridSkeleton count={Math.min(collection.artworkIds.length, 8)} />;
  if (result.status === "error") {
    return (
      <ErrorState
        title="No pudimos cargar las obras"
        description="El museo no respondió. Tu colección sigue guardada."
        onRetry={result.retry}
      />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {result.missing > 0 && (
        <p role="note" className="text-label text-ink-muted">
          {result.missing === 1 ? "1 obra ya no está" : `${result.missing} obras ya no están`} en la
          colección pública del museo.
        </p>
      )}
      <SortableArtworkList artworks={result.artworks} onMove={onMove} onRemove={onRemove} />
    </div>
  );
}
