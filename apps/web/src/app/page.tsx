import { FeaturedArtworks, HomeHero } from "@/features/home";
import { siteConfig } from "@/shared/config";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HomeHero title={siteConfig.name} description={siteConfig.description} />
      <div className="mx-auto w-full max-w-7xl px-4 pt-20 sm:px-8 sm:pt-28">
        <FeaturedArtworks />
      </div>
    </main>
  );
}
