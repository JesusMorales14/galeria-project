"use client";

import { useRouter } from "next/navigation";
import { EmptyState, Skeleton } from "@galeria/ui";
import { AppLink } from "@/shared/ui";
import { useCollections } from "../../hooks/useCollections";
import { CollectionArtworks } from "./CollectionArtworks";
import { CollectionHeader } from "./CollectionHeader";

/** Una colección guardada en este navegador. */
export function CollectionDetail({ id }: { id: string }) {
  const router = useRouter();
  const { collections, rename, remove, moveArtwork, removeArtwork } = useCollections();
  const collection = collections?.find((item) => item.id === id);

  if (collections === null) return <Skeleton className="h-24 w-2/3" />;
  if (!collection) {
    return (
      <EmptyState
        title="Esta colección no está en este navegador"
        description="Las colecciones se guardan en el navegador donde se crearon. Si te la enviaron, ábrela con su enlace para compartir."
        action={<AppLink href="/colecciones">Ver mis colecciones</AppLink>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <CollectionHeader
        collection={collection}
        onRename={(name) => rename(id, name)}
        onDelete={async () => {
          await remove(id);
          router.push("/colecciones");
        }}
      />
      <CollectionArtworks
        collection={collection}
        onMove={(artworkId, toIndex) => moveArtwork(id, { artworkId, toIndex })}
        onRemove={(artworkId) => removeArtwork(id, artworkId)}
      />
    </div>
  );
}
