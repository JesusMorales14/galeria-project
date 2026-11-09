import type { Artwork } from "@galeria/api-client";
import { searchArtworks } from "@/shared/api";
import { ArtworkGrid } from "@/shared/artwork";
import { RELATED_COUNT, relatedQuery } from "../../lib/relatedQuery";

/** Obras del mismo artista (o tipo). Si falla, no rompe la página: simplemente no aparece. */
export async function RelatedArtworks({ artwork }: { artwork: Artwork }) {
  const query = relatedQuery(artwork);
  if (!query) return null;

  const result = await searchArtworks(query).catch(() => null);
  const items =
    result?.items.filter((item) => item.id !== artwork.id).slice(0, RELATED_COUNT) ?? [];
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="relacionadas"
      className="flex flex-col gap-8 border-t border-line pt-12"
    >
      <h2 id="relacionadas" className="font-display text-title">
        {query.artist ? `Más de ${query.artist}` : "Obras relacionadas"}
      </h2>
      <ArtworkGrid artworks={items} />
    </section>
  );
}
