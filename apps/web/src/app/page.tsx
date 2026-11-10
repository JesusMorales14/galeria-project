import { FeaturedArtworks, HomeHero } from "@/features/home";
import { siteConfig } from "@/shared/config";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 py-10 sm:px-8 sm:py-16">
      <HomeHero title={siteConfig.name} description={siteConfig.description} />
      <FeaturedArtworks />
    </main>
  );
}
