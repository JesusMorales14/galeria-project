import { FeaturedArtworks, HomeIntro } from "@/features/home";
import { siteConfig } from "@/shared/config";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-16 sm:px-8 sm:py-24">
      <HomeIntro title={siteConfig.name} description={siteConfig.description} />
      <FeaturedArtworks />
    </main>
  );
}
