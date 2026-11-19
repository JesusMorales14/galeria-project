import { getArtworksByIds } from "@/shared/api";
import { SalonWall } from "@/shared/artwork";
import { FEATURED_ARTWORK_IDS } from "@/shared/config";

/** Obras destacadas. Los datos se cachean, así que entran en el HTML estático de la portada. */
export async function FeaturedArtworks() {
  // La primera cuelga en la portada (HomeHero); aquí van las demás.
  const artworks = (await getArtworksByIds(FEATURED_ARTWORK_IDS)).slice(1);
  if (artworks.length === 0) return null;

  return (
    <section aria-labelledby="destacadas" className="flex flex-col gap-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <h2 id="destacadas" className="font-display text-display">
          Obras destacadas
        </h2>
        <p className="max-w-[38ch] text-lg leading-7 text-ink-muted">
          Colgadas como en un salón del siglo XIX: juntas, a su tamaño y sin recortar ninguna.
        </p>
      </div>
      <SalonWall artworks={artworks} headingLevel={3} />
    </section>
  );
}
