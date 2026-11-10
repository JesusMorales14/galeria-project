import { getArtworksByIds } from "@/shared/api";
import { FEATURED_ARTWORK_IDS } from "@/shared/config";
import { HomeIntro } from "../HomeIntro";
import { HeroArtwork } from "./HeroArtwork";

type HomeHeroProps = { title: string; description: string };

/**
 * Portada: abre con una obra, no con un titular (frontend-design: lo más característico primero).
 * Comparte la consulta cacheada con las obras destacadas: una sola petición a la API.
 */
export async function HomeHero({ title, description }: HomeHeroProps) {
  const [hero] = await getArtworksByIds(FEATURED_ARTWORK_IDS);
  return (
    <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      {hero && <HeroArtwork artwork={hero} />}
      <HomeIntro title={title} description={description} />
    </div>
  );
}
