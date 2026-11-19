import { TextLink } from "@galeria/ui";
import { siteConfig } from "@/shared/config";

/** La salida de la sala: vuelve la penumbra del vestíbulo, con los créditos. */
export function SiteFooter() {
  return (
    <footer className="mt-24 bg-night text-night-ink-muted">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <p className="font-display text-5xl leading-none font-black text-night-ink">
          {siteConfig.name}
        </p>
        <div className="flex flex-col gap-2 font-sans text-label sm:items-end">
          <p>
            Obras e imágenes de la colección pública del{" "}
            <TextLink
              href="https://www.artic.edu"
              external
              className="text-night-ink decoration-night-ink-muted hover:text-light hover:decoration-light"
            >
              Art Institute of Chicago
            </TextLink>
            , en dominio público.
          </p>
          <p>
            <TextLink
              href={siteConfig.repositoryUrl}
              external
              className="text-night-ink decoration-night-ink-muted hover:text-light hover:decoration-light"
            >
              Código del proyecto
            </TextLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
