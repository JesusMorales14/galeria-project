import { HomeIntro } from "@/features/home";
import { siteConfig } from "@/shared/config";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24">
      <HomeIntro title={siteConfig.name} description={siteConfig.description} />
    </main>
  );
}
