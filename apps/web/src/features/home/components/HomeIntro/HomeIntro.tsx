import Link from "next/link";
import { buttonStyles } from "@galeria/ui";

type HomeIntroProps = { description: string };

/** Presentación de la portada, dentro de la sala oscura. Recibe sus textos por props. */
export function HomeIntro({ description }: HomeIntroProps) {
  return (
    <div className="flex flex-col items-start gap-7 lg:pb-2">
      <p className="max-w-[34ch] text-xl leading-8 text-night-ink">{description}</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/buscar" className={buttonStyles("inverse")}>
          Buscar en la colección
        </Link>
        <Link
          href="/colecciones"
          className="inline-flex min-h-11 items-center font-sans text-lg font-medium text-night-ink underline decoration-night-ink-muted underline-offset-[0.3em] transition-colors hover:text-light hover:decoration-light"
        >
          Ver mis colecciones
        </Link>
      </div>
    </div>
  );
}
