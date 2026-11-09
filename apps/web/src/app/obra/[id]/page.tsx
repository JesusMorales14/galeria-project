import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ArtworkDetailSkeleton,
  ArtworkPageSection,
  artworkMetadata,
  parseArtworkId,
} from "@/features/artwork";
import { getArtwork } from "@/shared/api";
import { FEATURED_ARTWORK_IDS } from "@/shared/config";

/**
 * ISR con Cache Components: las obras destacadas se generan en el build;
 * el resto se sirve con el "app shell" la primera vez y queda guardado.
 * Los datos se revalidan según cacheLife("days") en getArtwork.
 */
export function generateStaticParams() {
  return FEATURED_ARTWORK_IDS.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: PageProps<"/obra/[id]">): Promise<Metadata> {
  const id = parseArtworkId((await params).id);
  const artwork = id === null ? null : await getArtwork(id).catch(() => null);
  return artwork ? artworkMetadata(artwork) : { title: "Obra no encontrada" };
}

export default function ArtworkPage({ params }: PageProps<"/obra/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-10 sm:px-8 sm:py-14">
      <Suspense fallback={<ArtworkDetailSkeleton />}>
        <ArtworkPageSection params={params} />
      </Suspense>
    </main>
  );
}
