import { getArtworksByIds } from "@/shared/api";
import { ArtworkGrid } from "@/shared/artwork";
import { FEATURED_ARTWORK_IDS } from "@/shared/config";

/** Obras destacadas. Los datos se cachean, así que entran en el HTML estático de la portada. */
export async function FeaturedArtworks() {
  const artworks = await getArtworksByIds(FEATURED_ARTWORK_IDS);
  if (artworks.length === 0) return null;

  return (
    <section aria-labelledby="destacadas" className="flex flex-col gap-8">
      <h2 id="destacadas" className="font-display text-title">
        Obras destacadas
      </h2>
      <ArtworkGrid artworks={artworks} priorityCount={1} />
    </section>
  );
}
