import { getArtworksByIds } from "@/shared/api";
import { FEATURED_ARTWORK_IDS } from "@/shared/config";
import { HomeIntro } from "../HomeIntro";
import { HeroArtwork } from "./HeroArtwork";
import { LitRoom } from "./LitRoom";
import { RoomBanner } from "./RoomBanner";

type HomeHeroProps = { title: string; description: string };

const TITLE_ID = "portada-titulo";

/**
 * Portada: una sala en penumbra con la primera obra destacada bajo un foco
 * y el nombre del sitio como estandarte de fachada.
 * Comparte la consulta cacheada con las obras destacadas: una sola petición a la API.
 */
export async function HomeHero({ title, description }: HomeHeroProps) {
  const [hero] = await getArtworksByIds(FEATURED_ARTWORK_IDS);
  return (
    <LitRoom labelledBy={TITLE_ID}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)_auto] lg:items-end lg:gap-14 lg:py-14">
        {/* Primero en el DOM (el h1 encabeza la sección), último en pantalla. */}
        <div className="order-last lg:flex lg:flex-col lg:justify-end lg:self-stretch">
          <RoomBanner id={TITLE_ID} text={title} />
        </div>
        {hero && <HeroArtwork artwork={hero} />}
        <HomeIntro description={description} />
      </div>
    </LitRoom>
  );
}
