import Link from "next/link";
import { buttonStyles } from "@galeria/ui";
import { AppLink } from "@/shared/ui";

type HomeIntroProps = {
  title: string;
  description: string;
};

/** Presentación de la portada. Recibe sus textos por props: no sabe de dónde vienen. */
export function HomeIntro({ title, description }: HomeIntroProps) {
  return (
    <section aria-labelledby="home-intro-title" className="flex flex-col items-start gap-6">
      <h1 id="home-intro-title" className="font-display text-display text-ink">
        {title}
      </h1>
      <p className="max-w-[60ch] text-lg leading-8 text-ink-muted">{description}</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/buscar" className={buttonStyles("primary")}>
          Buscar en la colección
        </Link>
        <AppLink href="/colecciones">Ver mis colecciones</AppLink>
      </div>
    </section>
  );
}
