import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import type { Artwork } from "@galeria/api-client";
import { getArtwork } from "@/shared/api";
import { ArtworkGridSkeleton } from "@/shared/artwork";
import { parseArtworkId } from "../../lib/parseArtworkId";
import { ArtworkDetail, ArtworkJsonLd } from "../ArtworkDetail";
import { RelatedArtworks } from "../RelatedArtworks";

type ArtworkPageSectionProps = {
  params: Promise<{ id: string }>;
  /** Composición con otras features, decidida por la ruta (app/). */
  renderActions?: (artwork: Artwork) => ReactNode;
  renderMedia?: (artwork: Artwork) => ReactNode;
};

/** Carga la obra (con caché), o muestra el 404 propio si no existe. */
export async function ArtworkPageSection({
  params,
  renderActions,
  renderMedia,
}: ArtworkPageSectionProps) {
  const id = parseArtworkId((await params).id);
  const artwork = id === null ? null : await getArtwork(id);
  if (!artwork) notFound();

  return (
    <>
      <ArtworkJsonLd artwork={artwork} />
      <ArtworkDetail
        artwork={artwork}
        actions={renderActions?.(artwork)}
        media={artwork.image ? renderMedia?.(artwork) : undefined}
      />
      <Suspense fallback={<ArtworkGridSkeleton count={4} />}>
        <RelatedArtworks artwork={artwork} />
      </Suspense>
    </>
  );
}
